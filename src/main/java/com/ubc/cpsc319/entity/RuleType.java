package com.ubc.cpsc319.entity;

public enum RuleType {

    // Specified string is in the domain
    DOMAIN("Checks whether TEXT is in the domain\n\n" +
            "TEXT: string used to find a match (case insensitive, space sensitive)\n\n" +
            "Intended to use with common words found in spam emails (i.e. " +
            "mortgage, sale, prince) \n" +
            "Recommended risk level: 0.7+\n\n" +
            "See also: Username Iteration, Keyword, Attachment Name, ASCII"),
    // Specified string is anywhere in the email
    KEYWORD("Checks whether TEXT is found anywhere in the email (subject, body, addresses, " +
            "attachment names)\n\n" +
            "TEXT: string used to find a match (case insensitive, space sensitive)\n\n" +
            "Intended to use with common words found in spam emails (i.e. " +
            "mortgage, sale, prince) \n" +
            "Recommended risk level: 0.5+\n\n" +
            "See also: Domain, Attachment Name, ASCII"),
    // Specified string is found greater than specified number of times
    FREQUENCY("Checks whether TEXT is found in email body FREQUENCY number of times\n\n" +
            "TEXT: string used to find a match (case insensitive, space sensitive)\n" +
            "FREQUENCY: number of times TEXT must occur\n\n" +
            "Intended to use with common words found in spam emails(i.e. " +
            "mortgage, sale, prince) \n" +
            "Recommended risk level: 0.3-0.5\n\n" +
            "See also: Keyword, Domain, Attachment Name"),
    // Specified number of bytes is less than size of the email
    SIZE("Checks whether email size is greater than SIZE\n\n" +
            "SIZE: maximum number of bytes\n\n" +
            "Intended to prevent emails with massive bodies and attachments\n" +
            "Recommended risk level: 0.4 - 0.6\n\n" +
            "See also: Attachment Size"),
    // Specified number is less than number of attachments
    NO_OF_ATTACHMENTS("Checks whether number of email attachments is greater than NUMBER OF ATTACHMENTS\n\n" +
            "NUMBER OF ATTACHMENTS: maximum number of attachments\n\n" +
            "Intended to prevent emails flooding attachments\n" +
            "Recommended risk level: 0.5 - 0.7\n\n" +
            "See also: Attachment Size, Attachment Name, Size"),
    // Specified number is less than size of all attachments
    ATTACHMENT_SIZE("Checks whether any attachment size is greater than SIZE\n\n" +
            "SIZE: maximum number of bytes\n\n" +
            "Intended to prevent emails with massive attachments\n" +
            "Recommended risk level: 0.5 - 0.8\n\n" +
            "See also: Number of Attachments, Attachment Name, Size"),
    // Specified string is not in any attachment name
    ATTACHMENT_NAME("Checks whether TEXT is in any of the attachment names\n\n" +
            "TEXT: string used to find a match (case insensitive, space sensitive)\n\n" +
            "Intended to use with common words found in spam emails (i.e. " +
            "mortgage, sale, prince) \n" +
            "Recommended risk level: 0.7+\n\n" +
            "See also: Domain, Keyword"),
    // user name has been seen before with a different number identifier
    // Trying to catch issues like: johndoe632@freemail.com, johndoe672@freemail.com
    USERNAME_ITERATION("Checks whether usernames with different identifiers has sent an email " +
            "(i.e. johndoe325@gmail.com, johndoe679@gmail.com)\n\n" +
            "Recommended risk level: 0.5 - 0.6\n\n" +
            "See also: Domain, Keyword"),
    ASCII("Checks whether any text in the email uses characters not from US-ASCII\n\n" +
            "Intended to prevent emails from abusing special characters to mask words " +
            "(i.e. C̳o̳s̳t̳-̳c̳o̳)\n" +
            "Recommended risk level: 0.6-0.9\n\n" +
            "See also: Domain, Keyword"),
    // Blacklist taken from https://github.com/Steemhunt/temporary-email-blacklist/blob/master/blacklist.txt
    BLACKLIST("Checks whether email domain is in blacklist (5200+ domains)\n" +
            "See: https://github.com/Steemhunt/temporary-email-blacklist/blob/master/blacklist.txt\n\n" +
            "Recommended risk level: 0.9+\n\n" +
            "See also: ASCII");


    private final String description;

    RuleType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }
}
