require('dotenv').config();
const { mongoose, connect } = require('../../db/mongoose');
const { User } = require('../../models/User');
const { Room } = require('../../models/Room');
const { Message } = require('../../models/Message');
const { userSeedData, roomSeedData, messageSeedData } = require('./seedData');

const populateData = async () => {
    //   User.remove({}).then(() => {
    //     let userOne = new User(users[0]).save();
    //     let userTwo = new User(users[1]).save();
    //     return Promise.all([userOne, userTwo]).then(() => done());
    //   });

    if (mongoose.connection.readyState === 0) {
        connect();
    }

    let userId;
    let roomId;

    console.log('\n[PROCESS:SEED] Seeding User Data');

    await User.deleteMany({}).exec();

    for (let user of userSeedData) {
        const userData = await new User(user).save();
        userId = userData._id;
    }

    console.log('[PROCESS:FIN] Completed Seeding User Data');

    console.log('[PROCESS:SEED] Seeding Room Data');

    await Room.deleteMany({}).exec();

    for (let room of roomSeedData) {
        const roomData = await new Room({
            name: room.name,
            user: userId,
            access: room.password ? false : true,
            password: room.password
        }).save();
        roomId = roomData._id;
    }

    console.log('[PROCESS:FIN] Completed Seeding Room Data');

    console.log('[PROCESS:SEED] Seeding Message Data');

    await Message.deleteMany({}).exec();

    for (let message of messageSeedData) {
        await new Message({
            content: message.content,
            user: userId,
            room: roomId
        }).save();
    }

    console.log('[PROCESS:FIN] Completed Seeding Message Data');

    await mongoose.connection.close();
};

module.exports = { populateData };
