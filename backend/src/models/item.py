import dataclasses
import datetime
from models.model import Model


# This should match the ItemDetails DB schema
@dataclasses.dataclass
class ItemDetails(Model):
    id: int
    author_id: int
    title: str
    description: str
    external_location: str
    content: str
    content_url: str
    image_url: str
    thumbnail_url: str
    date_posted: datetime.datetime
    date_updated: datetime.datetime
    tags: list[str]

    @classmethod
    def table_creation_SQL(cls):
        # This is a hack mostly for local testing. See Model::table_creation_SQL.
        return """
        CREATE TABLE IF NOT EXISTS `Item` (
            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            `title` varchar(255) NOT NULL,
            `description` varchar(255) DEFAULT NULL,
            `content_url` varchar(255) NOT NULL,
            `content` text NOT NULL,
            `external_location` varchar(255) NOT NULL,
            `image_url` varchar(255) NOT NULL,
            `thumbnail_url` varchar(255) DEFAULT NULL,
            `author_id` bigint(20) unsigned DEFAULT NULL,
            `date_posted` timestamp NOT NULL DEFAULT current_timestamp(),
            `date_updated` timestamp NOT NULL DEFAULT current_timestamp(),
            UNIQUE KEY `id` (`id`),
            KEY `ItemAuthorId` (`author_id`),
            FULLTEXT KEY `content` (`content`),
            FULLTEXT KEY `title` (`title`),
            CONSTRAINT `ItemAuthorId` FOREIGN KEY (`author_id`) REFERENCES `Author` (`id`) ON UPDATE CASCADE
        );
        """

    def to_api_response(self):
        data = dataclasses.asdict(self)
        # TODO: better database field to api field mapping
        data["external_url"] = self.external_location
        return data

    @dataclasses.dataclass
    class AddOrEditField:
        field_name: str
        display_name: str
        element_type: str
        required: bool

    def get_add_or_edit_fields():
        return [
            ItemDetails.AddOrEditField("title", "Title", "text", True),
            ItemDetails.AddOrEditField("description", "Description", "text", False),
            ItemDetails.AddOrEditField("image_url", "Image URL", "text", True),
            ItemDetails.AddOrEditField("thumbnail_url", "Thumbnail URL", "text", False),
            ItemDetails.AddOrEditField("external_url", "External URL", "text", True),
            ItemDetails.AddOrEditField("tags", "Tags", "text", False),
            ItemDetails.AddOrEditField("content", "Content", "textarea", True),
        ]
