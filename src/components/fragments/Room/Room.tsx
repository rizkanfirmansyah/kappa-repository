import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import img4 from '../../../assets/DanuJungle/DeluxePoolVilla.jpg';
import img5 from '../../../assets/DanuJungle/DeluxeSuitewithPrivateHotTub.jpg';
import img6 from '../../../assets/DanuJungle/JungleSuite.jpg';
import img1 from '../../../assets/DanuRetreat/OneBedroomPoolVilla.jpg';
import img2 from '../../../assets/DanuRetreat/OneBedroomPoolVillawithView.jpg';
import img3 from '../../../assets/DanuRetreat/TwoBedroomPoolVilla.jpg';
import ApiServices from '../../../services/apis';
import { BASE_FILE_URL } from '../../../services/utils';
import { AppDispatch, RootState } from '../../../stores';
import { setToast } from '../../../stores/ui';
import Card from '../../elements/Card';
import ImageItem from '../RoomTypes/ImageItem';

type Props = {
  room: Room;
};

type DanuProps = {
  room: Room;
  dataRoom: ListImg[];
  detail: DanuDetail;
  onBack: () => void;
};
interface ListImg {
  id: number;
  roomId: number;
  img: string;
  name: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

const DataDanu: DanuDetail[] = [
  {
    id: 1,
    img: img1,
    title: 'One Bedroom Pool Villa',
    description:
      'One Bedroom Pool Villas are private sanctuaries set within the divine Danu Retreat. Surrounded by tropical foliage, these conscientiously designed one-bedroom villas offer ample space to relax and unwind. Spend endless days relaxing in the villa spacious bedroom and recharge waterside by the private infinity swimming pool.',
  },
  {
    id: 2,
    img: img2,
    title: 'One Bedroom Pool Villa with View',
    description:
      'These 12 units villas benefit exclusive up close and personal, a very intimate view towards the indigenous rice field of Ubuds rural and revered environment. All villas are conscientiously designed for ultimate comfort and offer premium scenery.',
  },
  {
    id: 3,
    img: img3,
    title: 'Two Bedroom Pool Villa',
    description:
      'These extensive elegant villas capture premium Ubuds charming signature rice field view. Both bedrooms are spacious allowing comfort and ultimate privacy. Generous bathrooms with lush vegetation offer separate showers and bathtubs. The resplendent rice paddies swaying in the breeze as you unwind by the striking private infinity swimming pool.',
  },
];

const DataJungle: DanuDetail[] = [
  {
    id: 1,
    img: img4,
    title: 'Deluxe Pool Villa',
    description:
      'Most significance feature in the Danu Jungle, the only one-unit Deluxe Pool Villa boasts large private infinity swimming pool jutting out to the lush vegetation and emerald rice paddy view. Spacious bathroom features a bath tub, double vanity units conveniently spaced within the extensive bathroom area. Take delight in the gentle sound of tropical birds and Ubud’s soothing natural melody while relaxing in your private veranda.',
  },
  {
    id: 2,
    img: img5,
    title: 'Deluxe Suite Private Hot Tub',
    description:
      'Aesthetically designed to offer ultimate indulgence and relaxation with the 1,8 X 1,5m sized private Jacuzzi available on the veranda. All suites are facilitated with spacious bathroom with bathtub and double vanity, a private veranda, large bedroom, private Jacuzzi, a spacious living area and fascinating views of Ubud’s jungle or jungle river pools.',
  },
  {
    id: 3,
    img: img6,
    title: 'Jungle Suite',
    description:
      'Impeccably nestled in Danu Jungle, the 11 units of Jungle Suites occupy the lower part of duplex styled accommodation and facilitated with intimate bathroom, double vanity, a private veranda, large bedroom with alluring views to the jungle or jungle river pools.',
  },
];

const ListImageEx: ListImg = {
  id: 1,
  roomId: 45,
  img: img1,
  name: 'One Bedroom Pool Villa',
  description:
    'One Bedroom Pool Villas are private sanctuaries set within the divine Danu Retreat. Surrounded by tropical foliage, these conscientiously designed one-bedroom villas offer ample space to relax and unwind. Spend endless days relaxing in the villa spacious bedroom and recharge waterside by the private infinity swimming pool.',
};

const DescDanu: React.FC<DanuProps> = ({ room, dataRoom, onBack }) => {
  const [listImg, setListImg] = useState<ListImg[]>([]);
  const { hotel, profile, cctvUrl } = useSelector((s: RootState) => s.hotel);
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0);
  const [ListImage, setListImage] = useState<ListImg | null>(ListImageEx);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [onBack]);

  return (
    <View style={styles.container}>
      <View style={styles.cardMiddle}>
        <FlatList
          removeClippedSubviews={false}
          focusable
          hasTVPreferredFocus
          numColumns={2}
          style={styles.menuList}
          keyExtractor={item => item.id.toString()}
          data={dataRoom}
          renderItem={({ item, index }) => (
            <ImageItem
              key={item.id}
              preferredFocus={index === 0}
              activeColor={profile?.primaryColor}
              source={{ uri: `${BASE_FILE_URL}/${item.img}` }}
              // text={item.text}
              style={styles.item2}
              onFocus={() => setListImage(item)}
            />
          )}
        />
      </View>

      {dataRoom.length > 0 && (
        <View style={styles.cardRight}>
          <Image
            source={{ uri: `${BASE_FILE_URL}/${ListImage.img}` }}
            resizeMode="cover"
            style={styles.image}
          />
          <Text style={styles.title2}>{ListImage.name}</Text>
          <Text style={styles.desc}>{ListImage.description}</Text>
        </View>
      )}
    </View>
  );
};

const Room: React.FC<Props> = ({ room }) => {
  const [detail, setDetail] = useState<DanuDetail | null>(null);
  const { profile } = useSelector((s: RootState) => s.hotel);
  const { image, setImage } = useState(0);
  const [listImg, setListImg] = useState<ListImg[]>([]);
  const { hotel, cctvUrl } = useSelector((s: RootState) => s.hotel);
  const [ListImage, setListImage] = useState<ListImg | null>(ListImageEx);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let isMounted = true;

    const getListImg = async () => {
      if (hotel == null) {
        return;
      }

      try {
        const resDanuRetreat = await ApiServices.getDanu(hotel.id, room.id);
        if (resDanuRetreat.status === 200) {
          if (isMounted) {
            setListImg(resDanuRetreat.data.data);
          }
        } else {
          dispatch(setToast({ message: 'Cannot get hotel rooms' }));
        }

        if (!isMounted) {
          return;
        }
      } catch (err) {
        console.log(err);
        dispatch(setToast({ message: 'Cannot get information' }));
      }
    };

    getListImg();
  }, [dispatch]);

  useEffect(() => {
    fetch(`${BASE_FILE_URL}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
      });
  }, []);
  return (
    <Card style={styles.card}>
      <FlatList
        horizontal
        data={listImg}
        keyExtractor={item => item.id.toString()}
        style={[styles.list, { display: detail == null ? 'flex' : 'none' }]}
        renderItem={({ item }) => (
          <ImageItem
            activeColor={profile?.primaryColor}
            source={{ uri: `${BASE_FILE_URL}/${item.img}` }}
            text={item.name}
            style={styles.item}
            onPress={() => setDetail(item)}
          />
        )}
      />
      {detail != null && (
        <DescDanu
          detail={detail}
          dataRoom={listImg}
          room={room}
          onBack={() => setDetail(null)}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginLeft: 3,
    marginRight: 3,
    overflow: 'hidden',
  },
  card2: {
    padding: 16,
    marginLeft: 6,
    marginRight: 6,
  },
  image: {
    height: 120,
    width: '70%',
    marginRight: 'auto',
    marginTop: 12,
    marginLeft: 'auto',
    borderRadius: 8,
  },
  list: {
    display: 'flex',
    flex: 1,
    padding: 10,
    height: 500,
  },
  cardRight: {
    backgroundColor: '#ffffffD5',
    marginLeft: 0,
    flex: 2,
    paddingLeft: 1,
    paddingRight: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  menuList: {
    padding: 6,
    width: '100%',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  cardMiddle: {
    flex: 3,
    marginRight: 0,
    flexWrap: 'wrap',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  desc: {
    color: '#000',
    fontFamily: 'Outfit-Light',
    marginLeft: 12,
    marginRight: 12,
    fontSize: 12,
    textAlign: 'justify',
    marginTop: 20,
  },
  menu: {
    marginLeft: 6,
    marginRight: 6,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'Outfit-SemiBold',
    marginTop: 0,
    textAlign: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 0.2,
  },
  title2: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Outfit-Medium',
    marginTop: 8,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 0.2,
  },
  background: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
  },
  profileImg: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  descContainer: {
    padding: 32,
    width: '40%',
  },
  profileRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    marginHorizontal: 6,
    width: 150,
    height: '100%',
  },
  item2: {
    height: 150,
  },
});

export default Room;
