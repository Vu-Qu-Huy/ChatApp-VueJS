/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2214878880")

  // update collection data
  unmarshal({
    "name": "chat_messages"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2214878880")

  // update collection data
  unmarshal({
    "name": "Gemini"
  }, collection)

  return app.save(collection)
})
