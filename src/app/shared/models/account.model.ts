/** Tipo retornado pelas queries GraphQL de Account */
export interface AccountDTO {
  id: string;
  accountName: string;
  institution: string;
  description?: string;
  balance: string;
  userId: string;
  integrationId?: string;
}

/** Input para mutations createAccount/updateAccount */
export interface AccountInput {
  accountName: string;
  institution: string;
  description?: string;
  userId: string;
  integrationId?: string;
}

/** Input para mutation linkAccount (vincular conta Pluggy) */
export interface LinkAccountInput {
  integrationId: string;
  pluggyAccountId: string;
  name: string;
  institution: string;
  description?: string;
}
