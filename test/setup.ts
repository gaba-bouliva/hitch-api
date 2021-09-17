import { getConnection } from 'typeorm';

global.afterEach(async () => {
  const conn = getConnection();

  // Fetch all the entities
  const entities = getConnection().entityMetadatas;

  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name); // Get repository
    await repository.clear(); // Clear each entity table's content
  }
  await conn.close();
});
