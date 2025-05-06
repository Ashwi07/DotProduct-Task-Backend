import { calculateSecretHash } from "../lib/cognito";
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  AuthFlowType,
  CognitoIdentityProviderClient,
  MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoUserAttributes } from "../dtos/cognito.dtos";
import config from "../config/config";

class CognitoService {
  static async createCognitoUser(
    username: string,
    cognitoUserAttributes: cognitoUserAttributes[]
  ) {
    const userPoolId = config.userPoolId;
    //create cognito client
    const cognitoParams = config.cognito;
    const cognitoClient = new CognitoIdentityProviderClient(cognitoParams);

    //admin create user params
    const userParams = {
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: cognitoUserAttributes,
      MessageAction: MessageActionType.SUPPRESS,
    };

    //admin command to create a user
    const command = new AdminCreateUserCommand(userParams);
    return await cognitoClient.send(command);
  }

  static async setUserPassword(username: string, password: string) {
    const userPoolId = config.userPoolId;
    //create cognito client
    const cognitoParams = config.cognito;
    const cognitoClient = new CognitoIdentityProviderClient(cognitoParams);
    //admin set user password params
    const userParams = {
      Password: password,
      Permanent: true,
      Username: username,
      UserPoolId: userPoolId,
    };

    //admin command to set a user's password
    const command = new AdminSetUserPasswordCommand(userParams);
    return await cognitoClient.send(command);
  }

  static async cognitoSignin(username: string, password: string) {
    const userPoolId = config.userPoolId;
    //create cognito client
    const cognitoParams = config.cognito;
    const cognitoClient = new CognitoIdentityProviderClient(cognitoParams);
    const secretHash = await calculateSecretHash(username);
    const clientId = config.userPool.ClientId;
    const userParams = {
      UserPoolId: userPoolId, // required
      ClientId: clientId, // required
      AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH, // auth method
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash, //generated from client secret
      },
    };
    //admin command to sign in user
    const command = new AdminInitiateAuthCommand(userParams);
    return await cognitoClient.send(command);
  }

  static async deleteCognitoUser(username: string) {
    const userPoolId = config.userPoolId;
    //create cognito client
    const cognitoParams = config.cognito;
    const cognitoClient = new CognitoIdentityProviderClient(cognitoParams);
    //admin delete user params
    const userParams = {
      UserPoolId: userPoolId,
      Username: username,
    };

    const command = new AdminDeleteUserCommand(userParams);
    return await cognitoClient.send(command);
  }
}

export default CognitoService;
