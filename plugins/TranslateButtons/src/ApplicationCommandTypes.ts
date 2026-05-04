export enum ApplicationCommandInputType {
    BUILT_IN = 0,
    BUILT_IN_TEXT = 1,
    BUILT_IN_NUMBER = 2,
    BUILT_IN_CHANNEL = 3,
    USER = 4,
    ROLE = 5,
    MENTIONABLE = 6,
    NUMBER = 7,
    ATTACHMENT = 8
}

export enum ApplicationCommandType {
    CHAT = 1,
    USER = 2,
    MESSAGE = 3
}

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11
}