/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2214878880")

  // update collection data
  unmarshal({
    "createRule": "user = @request.auth.id",
    "listRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2214878880")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null,
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
