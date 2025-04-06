// This is a client-side representation of the User model
class User {
  constructor(data) {
    this.voterId = data.voterId;
    this.facePhoto = data.facePhoto;
    this.createdAt = data.createdAt || new Date();
  }
}

export default User;
