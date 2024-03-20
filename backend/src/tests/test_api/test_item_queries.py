TEST_ITEMS_QUERY = """
  query items($tag: String, $search: String) {
    item_list(tag: $tag, search: $search) {
      items {
        id
        title
        author
        description
        thumbnail_url
        tags
      }
    }
  }
"""
