let db = {
  user: [
    {
      userId: 'dsfasd569adf3363sd9fbd9vbs9',
      email: 'name@email.com',
      handle: 'user',
      createdAt: '2020-03-04T22:32:00.387Z',
      imageUrl: 'image/whatever/whatever',
      bio: 'Hi, I am a user',
      website: 'www.example.com',
      location: 'Atlanta, GA'
    }
  ],
  screams: [
    {
      userHandle: 'user',
      body: 'This is the Scream body',
      createdAt: '2020-03-04T22:32:00.387Z',
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: 'user',
      screamId: 'as9d87f6asd90fa',
      createdAt: '2020-03-04T22:32:00.387Z',
      body: 'This is my comment on the Scream'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'John',
      read: 'true | false',
      screamId: 'as9d87f6asd90fa',
      type: 'like | comment',
      createdAt: '2020-03-04T22:32:00.387Z'
    }
  ]
}

const userDetails = {
  // Redux data  
  credentials: {
    userId: 'adf569DF97fs6DF7dsf06',
    email: 'name@example.com',
    handle: 'user',
    createdAt: '2020-03-04T22:32:00.387Z',
    imageUrl: 'image/whatever/whatever',
    bio: 'Hi, I am a user',
    website: 'www.example.com',
    location: 'Atlanta, GA'
  },
  likes: [
    {
      userHandle: 'user',
      screamId: 'dsfa0f796as0dfya'
    },
    {
      userHandle: 'user',
      screamID: 'sdfad809f7ads0'
    }
  ]
}