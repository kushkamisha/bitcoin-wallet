CREATE TABLE "MnemonicPhrases" (
    "MnemonicId"     SERIAL PRIMARY KEY NOT NULL,
    "UserId"         INT4 NOT NULL,
    "MnemonicPhrase" VARCHAR(449) NOT NULL,
    "CurrentPrKeyId" INT4 NOT NULL DEFAULT 0
);

CREATE TABLE "Wallets" (
    "WalletId"   SERIAL PRIMARY KEY NOT NULL,
    "UserId"     INT4 NOT NULL,
    "MnemonicId" INT4 NOT NULL,
    "Address"    VARCHAR(42) NOT NULL,
    "PrivateKey" VARCHAR(193) NOT NULL
);

CREATE TABLE "Users" (
    "UserId"   SERIAL PRIMARY KEY NOT NULL,
    "Username" VARCHAR(30) NOT NULL,
    "Password" VARCHAR(60) NOT NULL
);