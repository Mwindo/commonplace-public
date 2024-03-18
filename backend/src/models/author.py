import dataclasses
from models.model import Model


# This should match the Author DB schema
@dataclasses.dataclass
class Author(Model):
    id: int
    first_name: str
    last_name: str
    nick_name: str
    display_name: str
    email: str
    role: str
    username: str
    password: str

    def validate_fields(self) -> tuple[bool, list[str]]:
        missing_fields: list[str] = []
        for field in ['username', 'password']:
            if not getattr(self, field):
                missing_fields.append(field)
        valid = False if missing_fields else True
        return valid, missing_fields

    @classmethod
    def table_creation_SQL(cls):
        return """
            CREATE TABLE IF NOT EXISTS `Author` (
            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            `first_name` varchar(32) NOT NULL,
            `last_name` varchar(32) NOT NULL,
            `nick_name` varchar(32) NOT NULL,
            `display_name` varchar(32) NOT NULL,
            `email` varchar(255) NOT NULL,
            `role` varchar(32) NOT NULL,
            `username` varchar(32) NOT NULL,
            `password` varchar(255) NOT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `id` (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """
