const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Guru_Resource_Mangament', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    const collection = db.collection('terms');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Drop the old index (userId_1_termName_1)
    try {
      await collection.dropIndex('userId_1_termName_1');
      console.log('✅ Dropped old index: userId_1_termName_1');
    } catch (error) {
      console.log('Old index not found or already dropped:', error.message);
    }

    // Create the new index (userId_1_classId_1_termName_1)
    await collection.createIndex(
      { userId: 1, classId: 1, termName: 1 },
      { unique: true }
    );
    console.log('✅ Created new index: userId_1_classId_1_termName_1');

    // Show updated indexes
    const newIndexes = await collection.indexes();
    console.log('Updated indexes:', newIndexes);

    console.log('\n✅ Index migration completed successfully!');
    console.log('You can now restart your backend server and try adding terms again.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
});
