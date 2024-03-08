import dataclasses
import datetime


# This should match the ItemDetails DB schema
@dataclasses.dataclass
class ItemDetails:
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
