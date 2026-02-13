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
    const collection = db.collection('assessmenttypes');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Drop all old indexes except _id
    for (const index of indexes) {
      if (index.name !== '_id_') {
        try {
          await collection.dropIndex(index.name);
          console.log(`✅ Dropped old index: ${index.name}`);
        } catch (error) {
          console.log(`Could not drop index ${index.name}:`, error.message);
        }
      }
    }

    // Create the new index (userId_1_classId_1_termId_1_assessmentName_1)
    await collection.createIndex(
      { userId: 1, classId: 1, termId: 1, assessmentName: 1 },
      { unique: true }
    );
    console.log('✅ Created new index: userId_1_classId_1_termId_1_assessmentName_1');

    // Show updated indexes
    const newIndexes = await collection.indexes();
    console.log('Updated indexes:', newIndexes);

    console.log('\n✅ Assessment types index migration completed successfully!');
    console.log('You can now restart your backend server.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
});
