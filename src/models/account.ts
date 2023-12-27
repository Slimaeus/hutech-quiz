import jwt from "jsonwebtoken";

export interface Account {
  id: string;
  userName: string;
  givenName: string;
  email: string;
  roles: string[];
}

export class Account implements Account {
  id: string;
  userName: string;
  givenName: string;
  email: string;
  roles: string[];

  /**
   *
   */
  constructor(
    id: string,
    userName: string,
    givenName: string,
    email: string,
    roles: string[] = []
  ) {
    this.id = id;
    this.userName = userName;
    this.givenName = givenName;
    this.email = email;
    this.roles = roles;
  }

  static fromJson(decoded: jwt.JwtPayload) : Account {
    const id = decoded["nameid"] ?? "";
    const userName = decoded["unique_name"] ?? "";
    const givenName = decoded["given_name"] ?? "";
    const email = decoded["email"] ?? "";
    const roles = decoded["roles"] ?? [];
    const role = decoded["role"] ?? "";
    if (decoded["role"]) {
      roles.push(role);
    }
    return new Account(id, userName, givenName, email, roles);
  }
}
