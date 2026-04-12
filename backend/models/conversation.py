from pymongo import MongoClient, DESCENDING
from bson import ObjectId
import os


class ConversationModel:
    def __init__(self):
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
        self.client = MongoClient(mongo_uri)
        self.db = self.client['signbridge']
        self.collection = self.db['conversations']

    def save(self, doc: dict) -> str:
        result = self.collection.insert_one(doc)
        return str(result.inserted_id)

    def get_all(self, limit: int = 20) -> list:
        docs = self.collection.find(
            {}, {'messages': 0}  # Exclude full messages for list view
        ).sort('created_at', DESCENDING).limit(limit)
        return [self._serialize(d) for d in docs]

    def get_by_id(self, convo_id: str) -> dict | None:
        try:
            doc = self.collection.find_one({'_id': ObjectId(convo_id)})
            return self._serialize(doc) if doc else None
        except Exception:
            return None

    def delete(self, convo_id: str):
        self.collection.delete_one({'_id': ObjectId(convo_id)})

    @staticmethod
    def _serialize(doc: dict) -> dict:
        if not doc:
            return {}
        doc['_id'] = str(doc['_id'])
        return doc
