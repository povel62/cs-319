package com.ubc.cpsc319.service.impl;

import com.ubc.cpsc319.service.CacheService;
import com.ubc.cpsc319.service.RuleEvaluatorService;
import com.ubc.cpsc319.service.ProcessorService;
import com.ubc.cpsc319.service.PullService;
import microsoft.exchange.webservices.data.core.ExchangeService;
import microsoft.exchange.webservices.data.core.enumeration.misc.ExchangeVersion;
import microsoft.exchange.webservices.data.core.enumeration.notification.EventType;
import microsoft.exchange.webservices.data.core.enumeration.property.WellKnownFolderName;
import microsoft.exchange.webservices.data.core.service.item.Item;
import microsoft.exchange.webservices.data.credential.ExchangeCredentials;
import microsoft.exchange.webservices.data.credential.WebCredentials;
import microsoft.exchange.webservices.data.notification.GetEventsResults;
import microsoft.exchange.webservices.data.notification.ItemEvent;
import microsoft.exchange.webservices.data.notification.PullSubscription;
import microsoft.exchange.webservices.data.property.complex.FolderId;
import microsoft.exchange.webservices.data.search.FindItemsResults;
import microsoft.exchange.webservices.data.search.ItemView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
public class PullServiceImpl implements PullService {

    public static ExchangeService exchangeService;
    public static PullSubscription subscription;
    public static Boolean isServiceRunning = false;

    @Autowired
    private ProcessorService pc;
    @Autowired
    private CacheService cc;

    @Async("processExecutor")
    public void loop() throws Exception {
        cc.initCache();
        exchangeService = new ExchangeService(ExchangeVersion.Exchange2010_SP2);
        ExchangeCredentials credentials = new WebCredentials("povel@6v02sw.onmicrosoft.com", "Harsh-2355");
        exchangeService.setCredentials(credentials);
        exchangeService.setUrl(new URI("https://outlook.office365.com/ews/exchange.asmx"));

        List<FolderId> folder = new ArrayList();
        folder.add(new FolderId().getFolderIdFromWellKnownFolderName(WellKnownFolderName.Inbox));

        final int pageSize = 50;
        ItemView view = new ItemView(pageSize);
        FindItemsResults<Item> findResults;
        do {
            findResults = exchangeService.findItems(folder.get(0), view);
            for (Item item : findResults.getItems()) {
                item.load();
                pc.processItem(item, exchangeService);
            }
            view.setOffset(view.getOffset() + pageSize);
        } while (findResults.isMoreAvailable());


        subscription = exchangeService.subscribeToPullNotifications(folder, 5
                /* timeOut: the subscription will end if the server is not polled within 5 minutes. */, null /* watermark: null to start a new subscription. */, EventType.NewMail, EventType.Created, EventType.Deleted);

        while (isServiceRunning) {

            System.out.println("==========   CONTROLLER PULL    ==========");
            GetEventsResults events = subscription.getEvents();

            // Loop through all item-related events.
            for (ItemEvent itemEvent : events.getItemEvents()) {
                if (itemEvent.getEventType() == EventType.NewMail) {
                    Item item = Item.bind(exchangeService, itemEvent.getItemId());

                    pc.processItem(item, exchangeService);
//					MessageBody mb = new MessageBody();
//					mb.setBodyType(BodyType.Text);
//					mb.setText("HEHE");
//					item.setBody(mb);
//					item.update(ConflictResolutionMode.AutoResolve);
//					message.move(WellKnownFolderName.JunkEmail);
//                  message.delete(DeleteMode.SoftDelete);
                } else if (itemEvent.getEventType() == EventType.Created) {
                    Item item = Item.bind(exchangeService, itemEvent.getItemId());
                } else if (itemEvent.getEventType() == EventType.Deleted) {
                    break;
                }
            }
            // Wait 5 seconds, then poll the server for new events.
            // Maybe we can put this in the db as well to control
            Thread.sleep(5000);
        }
    }

    public String start() throws Exception {
        if (!isServiceRunning) {
            synchronized (isServiceRunning) {
                if (!isServiceRunning) {
                    isServiceRunning = true;
                    return "";
                } else {
                    System.out.println("==========   A pull service is already active   ==========");
                    return "A pull service is already active";
                }
            }
        } else {
            System.out.println("==========   A pull service is already active   ==========");
            return "A pull service is already active";
        }
    }

    public String stop() throws Exception {
        if (isServiceRunning) {
            synchronized (isServiceRunning) {
                if (isServiceRunning) {
                    if(subscription != null) {
                        try{
                            subscription.unsubscribe();
                        } catch (Exception e) {
                            e.printStackTrace();
                            System.out.println(e.getMessage());
                        }
                        subscription = null;
                    }
                    isServiceRunning = false;
                    return "";
                } else {
                    System.out.println("==========   No pull service is currently active    ==========");
                    return "No pull service is currently active";
                }
            }
        } else {
            System.out.println("==========   No pull service is currently active    ==========");
            return "No pull service is currently active";
        }
    }

    public boolean isServiceRunning() {
        return isServiceRunning;
    }
}


