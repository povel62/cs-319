from exchangelib import Account  # Definition,
from exchangelib import (
    Configuration,
    Credentials,
    ExtendedProperty,
    Message,
)
import sys

class ReportTag(ExtendedProperty):
    property_tag = 0x0031
    property_type = "Binary"

class VerbResponse(ExtendedProperty):
    distinguished_property_set_id = "Common"
    property_id = 0x8524
    property_type = "String"

def login(username, password):
    credentials = Credentials(username, password)
    c = Configuration(server="https://outlook.office365.com/ews/exchange.asmx", credentials=credentials)
    return Account(username, credentials=credentials, autodiscover=True)

def notify_me(account):
    m = None
    for message in account.inbox.all():
        if message.message_id == sys.argv[1]:
            mail_subject = ("Reject: " if sys.argv[2] == "true" else "Approve: ") + message.subject
            mail_item_class = "IPM.Note.Microsoft.Approval.Reply.Reject" if sys.argv[2] == "true" else "IPM.Note.Microsoft.Approval.Reply.Approve"
            mail_verb_response = "Reject" if sys.argv[2] == "true" else "Approve"
            mail_body = sys.argv[3] + message.body

            m = Message(
            account=account,
            folder=account.sent,
            subject=mail_subject,
            to_recipients=[message.sender],
            item_class=mail_item_class,
            verb_response=mail_verb_response,
            report_tag=message.report_tag,
            body=mail_body,
            )
            m.send_and_save()

    return {'message': 'Message Id: [' + sys.argv[1] + '] successfully ' + ('Rejected' if sys.argv[2] == "true" else 'Approved') }, 200, {'Content-Type': 'text/xml; charset=utf-8'}

Message.register("verb_response", VerbResponse)
Message.register("report_tag", ReportTag)
notify_me(login(username="povel@6v02sw.onmicrosoft.com", password="Harsh-2355"))
