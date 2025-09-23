import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync(
    'PRAGMA user_version'
  );
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(
      `
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time_block INTEGER NOT NULL,
        agenda_date INTEGER DEFAULT (unixepoch()),
        title TEXT NOT NULL,
        description TEXT,
        reminder_time INTEGER,
        done BOOLEAN DEFAULT false
      );
      `
    );

    await db.execAsync(
      `
      INSERT INTO tasks(time_block, title, description, done) VALUES
        (0, 'Exercise', NULL, false),
        (0, 'Listen to business podcast', NULL, true),
        (1, 'Finalise presentation', 'Work on draft with Rahul.', true),
        (1, 'Talk to client', 'Call Mr Deshmukh at 11 am for the new proposals.', false),
        (1, 'Read report', NULL, false),
        (2, 'Start the new assignment.', '<Assignment details>', false),
        (2, 'Review today''s output.', 'Also plan for tomorrow.', false),
        (3, 'Catch up with friends.', NULL, false),
        (4, 'Read book.', NULL, false);
      `
    )
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
