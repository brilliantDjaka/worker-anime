## Worker to crawl data from https://myanimelist.net/ to mongodb

### How to run:
- create .env based on .env.example
- fill your mongodb uri & db name at .env file
- run `node index`

### Example Data
```
[{
  "_id": {
    "$oid": "6263bd774b2f2c838c7ffe68"
  },
  "link": "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood",
  "title": "Fullmetal Alchemist: Brotherhood",
  "thumb": "https://cdn.myanimelist.net/r/50x70/images/anime/1223/96541.jpg?s=faffcb677a5eacd17bf761edd78bfb3f",
  "ranking": "1",
  "id": "5114",
  "image": "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
}]
```
