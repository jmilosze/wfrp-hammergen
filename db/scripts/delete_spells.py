import os

import pymongo
from bson import ObjectId

# Get MongoDB connection details from environment variables
mongo_uri = os.environ.get("MONGO_URI")
db_name = os.environ.get("DB_NAME")

# Connect to MongoDB
client = pymongo.MongoClient(mongo_uri)
db = client[db_name]
spell_collection = db["spell"]

# ObjectIDs to delete
object_ids_to_delete = [ObjectId('67e3269527f5eb7ded51bd1c'), ObjectId('67e3269527f5eb7ded51bd1d'), ObjectId('67e3269527f5eb7ded51bd1e'), ObjectId('67e3269527f5eb7ded51bd1f'), ObjectId('67e3269527f5eb7ded51bd20'), ObjectId('67e3269527f5eb7ded51bd21'), ObjectId('67e3269527f5eb7ded51bd22'), ObjectId('67e3269527f5eb7ded51bd23'), ObjectId('67e3269527f5eb7ded51bd24'), ObjectId('67e3269527f5eb7ded51bd25'), ObjectId('67e3269527f5eb7ded51bd26'), ObjectId('67e3269527f5eb7ded51bd27')]


# Function to delete spells by IDs
def delete_spells_by_ids(object_ids):
    # Print initial count
    initial_count = spell_collection.count_documents({})
    print(f"Collection initially has {initial_count} documents.")

    # Delete the documents
    result = spell_collection.delete_many({"_id": {"$in": object_ids}})

    # Print results
    print(f"Successfully deleted {result.deleted_count} documents.")

    # Count documents after deletion
    remaining_count = spell_collection.count_documents({})
    print(f"Collection now has {remaining_count} documents.")

    # Print the IDs that were not found (if any)
    if result.deleted_count < len(object_ids):
        # Get the IDs that were successfully deleted
        deleted_docs = []
        for obj_id in object_ids:
            if spell_collection.count_documents({"_id": obj_id}) == 0:
                deleted_docs.append(obj_id)

        # Find the missing IDs
        missing_ids = [str(obj_id) for obj_id in object_ids if obj_id not in deleted_docs]
        print(f"The following IDs were not found in the collection: {missing_ids}")


# Execute the deletion function
if __name__ == "__main__":
    try:
        print(f"Attempting to delete {len(object_ids_to_delete)} documents...")
        delete_spells_by_ids(object_ids_to_delete)
        print("Spell deletion completed successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Close the MongoDB connection
        client.close()
        print("MongoDB connection closed.")
