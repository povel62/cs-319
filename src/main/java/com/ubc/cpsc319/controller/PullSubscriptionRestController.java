package com.ubc.cpsc319.controller;

import com.ubc.cpsc319.service.PullService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = { "/api/pull" })
@CrossOrigin
public class PullSubscriptionRestController {

    @Autowired
    PullService pullService;

    @RequestMapping(value="/start", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity startService() throws Exception {
       String start = pullService.start();
       if(!start.isEmpty()) {
           return ResponseEntity.ok().body(start);
       } else {
           pullService.loop();
           System.out.println("==========   Pull Service Started    ==========");
           return ResponseEntity.ok().body("Pull Service Started");
       }
    }


    @RequestMapping(value="/stop", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity stopService() throws Exception {
        String stop = pullService.stop();
        if(!stop.isEmpty()) {
            return ResponseEntity.ok().body(stop);
        } else {
            System.out.println("==========   Pull Service Stopped    ==========");
            return ResponseEntity.ok().body("Pull Service Stopped");
        }
    }

    @RequestMapping(value="/status", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity isServiceRunning() {
        return ResponseEntity.ok().body(pullService.isServiceRunning());
    }
}
