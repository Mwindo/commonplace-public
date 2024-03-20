import dataclasses

from models.item import ItemDetails
from models.model import Model


# This should match the ItemTagMapping DB schema
@dataclasses.dataclass
class ItemTagMapping(Model):
    tag_value: str
    item_id: int

    table_name = "ItemTagMapping"

    @classmethod
    def table_creation_SQL(cls):
        # This is a hack mostly for local testing. See Model::table_creation_SQL.
        return f"""
            CREATE TABLE IF NOT EXISTS `{ItemTagMapping.table_name}` (
            `tag_value` varchar(32) NOT NULL,
            `item_id` bigint(20) unsigned NOT NULL,
            UNIQUE KEY `unique_index` (`tag_value`,`item_id`),
            KEY `TagMapsToID` (`item_id`),
            CONSTRAINT `TagMapsToID` FOREIGN KEY (`item_id`) 
            REFERENCES `{ItemDetails.table_name}` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """
