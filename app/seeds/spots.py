from app.models import db, Spots

def seed_spots():
    spot1 = Spots(
        userId='2', name='Spacious 6 Bedroom Home w| Game Room', price='300',streetAdress='222 twenty two drive', city='Atlanta', state='Georgia', zip='11111', img1='https://a0.muscache.com/im/pictures/miso/Hosting-54250975/original/10d44482-04f7-4981-a9b7-8f53a9aa90cf.jpeg?im_w=720', img2='https://a0.muscache.com/im/pictures/8e5a03fb-7f5a-4348-8a4a-929de8c6d7a3.jpg?im_w=720', img3='https://a0.muscache.com/im/pictures/miso/Hosting-54250975/original/cf3b8fed-ceaa-4712-b51d-50e5978e1751.jpeg?im_w=720', img4='https://a0.muscache.com/im/pictures/302f97e3-e29d-4bc5-acb1-089c818e5d8a.jpg?im_w=720', img5='https://a0.muscache.com/im/pictures/miso/Hosting-54250975/original/2d824cd5-da17-4617-889c-92a63d8b9bbe.jpeg?im_w=1200'
    )
    spot2 = Spots(
        userId='2', name='Spacious & elegant 5 bedroom house with amenities.', price='800',streetAdress='222 twenty two drive', city='Atlanta', state='Georgia', zip='11111', img1='https://a0.muscache.com/im/pictures/45095aa8-51d4-4601-99bb-2ecc97599bdf.jpg?im_w=1200', img2='https://a0.muscache.com/im/pictures/c2cd9545-c42a-42b7-b96a-1e53f36c289b.jpg?im_w=1200', img3='https://a0.muscache.com/im/pictures/e74545c1-459a-47ec-a87f-35b3d31c9984.jpg?im_w=1200', img4='https://a0.muscache.com/im/pictures/19ee7071-e8e1-4dd0-968a-c16d2725a0a7.jpg?im_w=720',  img5='https://a0.muscache.com/im/pictures/abe1c72d-2bac-4482-9378-1afd578366cb.jpg?im_w=1200'
    )
    spot3 = Spots(
        userId='2', name='Spacious Four Bedroom Cottage close to Campus', price='100',streetAdress='222 twenty two drive', city='Blacksburg', state='Virginia', zip='11111', img1='https://a0.muscache.com/im/pictures/miso/Hosting-53043542/original/005985f8-d83f-4f7b-99a6-0c174a36d1a4.jpeg?im_w=1200', img2='https://a0.muscache.com/im/pictures/miso/Hosting-53043542/original/99968295-a4a1-46a3-b100-7e0b4407e03b.jpeg?im_w=1200', img3='https://a0.muscache.com/im/pictures/miso/Hosting-53043542/original/a344185a-4cba-4b8b-82e5-460dc35fb2c1.jpeg?im_w=1200', img4='https://a0.muscache.com/im/pictures/miso/Hosting-53043542/original/399a0023-e30d-419f-99c2-98b3c53a8df3.jpeg?im_w=1200', img5='https://a0.muscache.com/im/pictures/miso/Hosting-53043542/original/a87e0012-11af-4599-b146-2a819f38c595.jpeg?im_w=960'
    )
    spot4 = Spots(
        userId='2', name='Close to RU and VT - Home Away from Home', price='349',streetAdress='222 twenty two drive', city='Blacksburg', state='Virginia', zip='11111', img1='https://a0.muscache.com/im/pictures/miso/Hosting-679742874265538531/original/e92ab328-7a96-4ce9-ab6a-d4b892244524.jpeg?im_w=960', img2='https://a0.muscache.com/im/pictures/miso/Hosting-679742874265538531/original/6300def6-ad36-4adf-a5a3-9f6d71dc964d.jpeg?im_w=1200', img3='https://a0.muscache.com/im/pictures/miso/Hosting-679742874265538531/original/fe3ee5f4-0f59-40ef-9886-811d5d43afd0.jpeg?im_w=1200', img4='https://a0.muscache.com/im/pictures/miso/Hosting-679742874265538531/original/1587a69f-cb99-4d68-8912-87b5ff78e715.jpeg?im_w=1200', img5='https://a0.muscache.com/im/pictures/miso/Hosting-679742874265538531/original/b2b9dc0c-fdfa-4a41-8980-7ef2aedca376.jpeg?im_w=1200'
    )
    spot5 = Spots(
        userId='2', name='Turtle Cay Resort - Spacious 2BR/2BA w/Great Pools', price='428',streetAdress='222 twenty two drive', city='Virginia Beach', state='Virginia', zip='11111', img1='https://a0.muscache.com/im/pictures/miso/Hosting-30415055/original/480d8cf0-dad8-4e0f-9aa5-9d6fdd664b1a.jpeg?im_w=1200', img2='https://a0.muscache.com/im/pictures/miso/Hosting-30415055/original/2fa75a59-a2ff-466c-8ec5-f56250dc2639.jpeg?im_w=1200', img3='https://a0.muscache.com/im/pictures/e13a0c1b-3a86-4d1b-8d34-6c4a22ea3f20.jpg?im_w=1200', img4='https://a0.muscache.com/im/pictures/miso/Hosting-30415055/original/d458d2da-d773-46fa-8897-cbe213d1fdc2.jpeg?im_w=720', img5='https://a0.muscache.com/im/pictures/miso/Hosting-30415055/original/90c6bdf0-c28c-4a90-a3f6-447ea7408e6c.jpeg?im_w=1200'
    )
    spot6 = Spots(
        userId='2', name='Lakefront home with water access', price='421',streetAdress='222 twenty two drive', city='Virginia Beach', state='Virginia', zip='11111', img1='https://a0.muscache.com/im/pictures/prohost-api/Hosting-594951796618545873/original/96d4bfc2-f458-4d59-9f50-d2272a87d6c7.jpeg?im_w=1200', img2='https://a0.muscache.com/im/pictures/prohost-api/Hosting-594951796618545873/original/d824a06a-b516-4a5a-a8c5-3cb231cec95d.jpeg?im_w=1200', img3='https://a0.muscache.com/im/pictures/prohost-api/Hosting-594951796618545873/original/8264c1d7-9c44-41b6-a380-90942fe5c743.jpeg?im_w=1200', img4='https://a0.muscache.com/im/pictures/prohost-api/Hosting-594951796618545873/original/e380dc63-e8fb-4773-9e5c-8c76a874df91.jpeg?im_w=1200', img5='https://a0.muscache.com/im/pictures/prohost-api/Hosting-594951796618545873/original/a93921c7-82c2-45cd-84c6-7d36619ca1f6.jpeg?im_w=1200'
    )
    spot7 = Spots(
        userId='2', name='Lovely BEACH FRONT apartment, on Ocean Blvd!', price='623',streetAdress='222 twenty two drive', city='Long Beach', state='California', zip='11111', img1='https://a0.muscache.com/im/pictures/miso/Hosting-51390774/original/9e74dc2d-37bd-4a8d-8ab7-72b4c2c82cb5.jpeg?im_w=720', img2='https://a0.muscache.com/im/pictures/441703a3-9e83-4862-afa6-c2e0b46e0dca.jpg?im_w=1200', img3='https://a0.muscache.com/im/pictures/miso/Hosting-51390774/original/ed5cd62a-a825-4f73-831b-b2145b5da105.png?im_w=1200', img4='https://a0.muscache.com/im/pictures/miso/Hosting-51390774/original/6e1c8f2c-fa52-4869-b60f-bd8a8b91e9f0.png?im_w=720', img5='https://a0.muscache.com/im/pictures/84fa7065-5d30-436a-b7c5-2fe4f2b233ba.jpg?im_w=720'
    )
    spot8 = Spots(
        userId='2', name='Charming Modern-Cozy Bungalow in Long Beach', price='600',streetAdress='222 twenty two drive', city='Long Beach', state='California', zip='11111', img1='https://a0.muscache.com/im/pictures/74b490f0-1bf7-4013-8b53-b40bdabfcc75.jpg?im_w=1200', img2='https://a0.muscache.com/im/pictures/miso/Hosting-590684380045048780/original/61552a7a-765d-4f31-b4e0-aceb6be1ea19.jpeg?im_w=960', img3='https://a0.muscache.com/im/pictures/miso/Hosting-590684380045048780/original/45703734-4ac1-4fce-9bfb-7e5dc630cc9c.jpeg?im_w=720', img4='https://a0.muscache.com/im/pictures/miso/Hosting-590684380045048780/original/42e53e29-9702-40b2-8ef7-794e380c66b7.jpeg?im_w=1200', img5='https://a0.muscache.com/im/pictures/miso/Hosting-590684380045048780/original/710d545d-de7b-4371-a163-1667bfed1d72.jpeg?im_w=1200'
    )
    spot9 = Spots(
        userId='2', name='Private Victorian Home · Mission Dolores Park', price='983',streetAdress='222 twenty two drive', city='San Francisco', state='California', zip='11111', img1='https://a0.muscache.com/im/pictures/0977a0fb-e74e-410c-80b1-6c98add46584.jpg?im_w=720', img2='https://a0.muscache.com/im/pictures/65c9c9af-ec8d-4c47-91bb-3f204778b299.jpg?im_w=1200', img3='https://a0.muscache.com/im/pictures/8c1bb3c0-6bdc-4eb6-97a3-06bb1639005a.jpg?im_w=1200', img4='https://a0.muscache.com/im/pictures/b1f0c257-5bd0-44cf-a7f0-3ee1617a735b.jpg?im_w=1200', img5='https://a0.muscache.com/im/pictures/fd52f31c-763e-44b0-891d-d65815bfb9b4.jpg?im_w=1200'
    )
    spot10 = Spots(
        userId='2', name='New Home with attached garage and rooftop deck!', price='166',streetAdress='222 twenty two drive', city='Pittsburgh', state='Pennsylvania', zip='11111', img1='https://a0.muscache.com/im/pictures/miso/Hosting-640044321018783406/original/4b979a68-a2b8-4628-8bbf-9a378d546d76.jpeg?im_w=1200', img2='https://a0.muscache.com/im/pictures/miso/Hosting-640044321018783406/original/7a9d183c-59bf-4e98-962d-adc606b98815.jpeg?im_w=1200', img3='https://a0.muscache.com/im/pictures/miso/Hosting-640044321018783406/original/7c7960f2-d1e5-4fe3-a60b-220e5e9edc3a.jpeg?im_w=1200', img4='https://a0.muscache.com/im/pictures/miso/Hosting-640044321018783406/original/d3d932ce-498d-4a3d-9810-7a12432bb689.jpeg?im_w=1200', img5='https://a0.muscache.com/im/pictures/miso/Hosting-640044321018783406/original/5e6140b3-7b3c-4711-89ca-0cda6eba0ec7.jpeg?im_w=1200'
    )

    db.session.add(spot1)
    db.session.add(spot2)
    db.session.add(spot3)
    db.session.add(spot4)
    db.session.add(spot5)
    db.session.add(spot6)
    db.session.add(spot7)
    db.session.add(spot8)
    db.session.add(spot9)
    db.session.add(spot10)
    db.session.commit()

def undo_spots():
    db.session.execute('TRUNCATE spots RESTART IDENTITY CASCADE;')
    db.session.commit()
