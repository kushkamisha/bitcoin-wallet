CREATE TABLE "MnemonicPhrases" (
    "MnemonicId"     SERIAL PRIMARY KEY NOT NULL,
    "UserId"         INT4 NOT NULL,
    "MnemonicPhrase" VARCHAR(673) NOT NULL
);

CREATE TABLE "Wallets" (
    "WalletId"   SERIAL PRIMARY KEY NOT NULL,
    "UserId"     INT4 NOT NULL,
    "MnemonicId" INT4 NOT NULL,
    "Address"    VARCHAR(42) NOT NULL,
    "PrivateKey" VARCHAR(193) NOT NULL
);