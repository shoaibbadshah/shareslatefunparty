import React, {useEffect, useRef, useState} from 'react';

import {
  Text,
  View,
  Alert,
  FlatList,
  TextInput,
  StatusBar,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import {fetchUserFollowersAndFollowing} from '../../Store/Actions/profile';
import {inviteToFunParty} from '../../Store/Actions/minis';
import {NAVIGATION_ROUTES} from '../../Utils/Navigation/NavigationRoutes';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import {
  searchByName,
  checkImageUrl,
  generateRandomMeetId,
  generateLink,
} from '../../Utils/helpers';
import MinisSearch from '../../Assets/MinisSearch';
import WatchPartyGuide from '../../Components/WatchPartyGuide';
import {navigationRef} from '../../Utils/Navigation/navigationRef';
import LeftArrow from '../../Utils/Assets/Icons/LeftArrow';
import Menu from '../../Components/Profile/Menu';

const {width, height} = Dimensions.get('screen');

const FunPartyInvite = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  console.log(
    '🚀 ~ file: FunPartyInvite.js:42 ~ FunPartyInvite ~ checked:',
    checked,
  );

  const [guidCheck, setGuidCheck] = useState(true);
  const [isloading, setisloading] = useState(true);
  const [friend, setFriend] = useState([]);

  const refRBSheetFarward = useRef(null);
  const handleMenu = () => {
    refRBSheetFarward.current.handleMenu();
  };
  const theme = useSelector(e => e.theme);

  const userFollowing = useSelector(
    e => e.userFollowerFollowing?.userFollowing,
  );

  const userFollower = useSelector(e => e.userFollowerFollowing?.userFollower);
  const [search, setSearch] = useState('');
  const allUser = [...userFollowing, ...userFollower];
  const filterSearch = search
    ? userFollowing?.filter(x =>
        x.first_name.toLowerCase().includes(search.toLowerCase()),
      )
    : userFollowing;

  const LOADING = useSelector(e => e.userFollowerFollowing?.isLoading);

  useEffect(() => {
    dispatch(fetchUserFollowersAndFollowing(setisloading));
    setFriend(allUser);
  }, []);

  const onChangeText = e => {
    const searchName = searchByName(e, friend);
    setFriend(searchName);
    setSearch(e);
  };

  const handleDynamicLink = link => {
    console.log(
      '🚀 ~ file: FunPartyInvite.js:81 ~ handleDynamicLink ~ link:',
      link,
    );
    // Handle dynamic link inside your own application
    if (link.url === 'https://invertase.io/offer') {
      // ...navigate to your offers screen
    }
  };

  // useEffect(() => {
  //   const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
  //   // When the component is unmounted, remove the listener
  //   return () => unsubscribe();
  // }, []);

  // useEffect(() => {
  //   dynamicLinks()
  //     .getInitialLink()
  //     .then(link => {
  //       console.log(
  //         '🚀 ~ file: FunPartyInvite.js:104 ~ useEffect ~ link:',
  //         link,
  //       );
  //       if (link.url === 'https://invertase.io/offer') {
  //         // ...set initial route as offers screen
  //       }
  //     });
  // }, []);

  const handleInvitePress = async () => {
    const randomMeetId = generateRandomMeetId();

    const generate = await generateLink(randomMeetId);
    console.log(generate, 'new generate', randomMeetId);
    if (guidCheck) {
      setGuidCheck(!guidCheck);
    } else {
      // const selectedUsersIds = checked.map(index => {
      //   if (index && friend[index] && friend[index]._id) {
      //     const fff = friend[index]._id;
      //     console.log(
      //       '🚀 ~ file: FunPartyInvite.js:124 ~ selectedUsersIds ~ fff:',
      //       fff,
      //     );
      //     if (!friend[index]._id) {
      //       return null;
      //     } else {
      //       return friend[index]._id;
      //     }
      //   }
      // });
      // console.log(
      //   '🚀 ~ file: FunPartyInvite.js:134 ~ selectedUsersIds ~ selectedUsersIds:',
      //   selectedUsersIds,
      // );

      // const RoomID = `https://meet.shareslate.fun/${randomMeetId}?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI4QjIzQTRCQTg1REU4NUQyOTIyNzAzRjMxOTQ5NjkzNCIsImlzcyI6IjhCMjNBNEJBODVERTg1RDI5MjI3MDNGMzE5NDk2OTM0Iiwic3ViIjoiKiIsInJvb20iOiIqIiwiaWF0IjoxNzAxMTA4ODA3LCJuYmYiOjE3MDEwOTk3MjAsImV4cCI6MTc0MTgwODUyMH0.VuPKduPs0droOLlH05w9QeL9ZNdEDyWmeSnTFzaXcJQ`;
      const body = {
        users: checked,
        room: generate,
      };
      console.log(
        '🚀 ~ file: FunPartyInvite.js:146 ~ handleInvitePress ~ body:',
        body,
      );

      dispatch(inviteToFunParty(body));
      setGuidCheck(!guidCheck);
      navigation.navigate(NAVIGATION_ROUTES.JITSI, {roomId: randomMeetId});
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: NAVIGATION_ROUTES.JITSI, RoomID: RoomID }],
      // });
    }
  };

  const toggleCheck = (item, index) => {
    console.log(
      '🚀 ~ file: FunPartyInvite.js:158 ~ toggleCheck ~ item:',
      item._id,
    );
    setChecked([...checked, item._id]);
    console.log(
      '🚀 ~ file: FunPartyInvite.js:163 ~ toggleCheck ~ checked:',
      checked,
    );
    // const isSelected = checked.includes(index);
    // if (isSelected) {
    // setChecked(checked.filter(itemIndex => itemIndex !== index));

    // } else {
    //   if (checked.length < 5) {
    //     setChecked([...checked, index]);
    //   } else {
    //     Alert.alert('Invite contact', 'Up to 5 contacts can be invited.');
    // }
    // }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme?.primary}]}>
      <StatusBar barStyle={theme.StatusBar} />

      {guidCheck ? (
        <View style={{paddingHorizontal: 15, flex: 1}}>
          <View
            style={[
              styles.flexStyle,
              {
                // width: width - width / 2 + 40,
                marginBottom: height - height + 20,
              },
            ]}>
            {/* <Icon
                name='chevron-back'
                size={23}
                color={theme.text}
                onPress={() => {
                  navigation.goBack();
                }}
              /> */}
            {/* <LeftArrow
                onPress={() => navigationRef.current?.goBack()}
                color={'white'}
                width={24}
                height={24}
              /> */}
            <Text style={{color: theme.text, fontWeight: 'bold', fontSize: 17}}>
              FunParty Invite
            </Text>
            <Icon
              name="settings-outline"
              size={22}
              color={theme.text}
              style={{paddingRight: 12}}
              onPress={handleMenu}
            />
          </View>
          <View style={{position: 'relative'}}>
            <View
              style={{
                backgroundColor: '#1B2438',
                height: 45,
                //width: '100%',
                marginHorizontal: 15,
                marginVertical: 15,
                borderRadius: 10,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 15,
              }}>
              <MinisSearch color={'#B3B3B3'} width={18} height={18} />
              <TextInput
                onChangeText={onChangeText}
                style={{
                  width: '82%',
                  color: 'white',
                  textAlign: 'left',
                  marginLeft: 4,
                }}
                placeholderTextColor={'#B3B3B3'}
                returnKeyType={'search'}
                selectTextOnFocus={false}
                contextMenuHidden={true}
                placeholder={'Search contacts'}
              />
              <View
                style={{
                  backgroundColor: '#303D5B',
                  borderWidth: 1,
                  borderColor: 'black',
                  //backgroundColor: 'black',
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingHorizontal: 12,
                }}>
                <Text style={{color: 'white'}}>Search</Text>
              </View>
            </View>
          </View>

          <FlatList
            data={filterSearch}
            contentContainerStyle={{paddingBottom: 245}}
            ListEmptyComponent={() => (
              <View
                style={{
                  height: height - 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {isloading ? (
                  <ActivityIndicator color={theme.text} size={'large'} />
                ) : (
                  <Text style={{color: theme.text}}>
                    you don't have any friends yet
                  </Text>
                )}
              </View>
            )}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <View style={styles.inviteUser}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      backgroundColor: '#00000010',
                      borderRadius: width,
                      marginRight: 20,
                      overflow: 'hidden',
                    }}>
                    <FastImage
                      // defaultSource={require("../../Assets/avatar.jpg")}
                      // source={{ uri: checkImageUrl(item?.profile_image) }}
                      source={{
                        uri: checkImageUrl(
                          item?.profile_image,
                          `https://ui-avatars.com/api/?background=random&name=${item?.first_name}+${item?.last_name}`,
                        ),
                      }}
                      resizeMode={'cover'}
                      style={{width: '100%', height: '100%'}}
                    />
                  </View>
                  <Text style={{color: theme.text, fontWeight: 'bold'}}>
                    {item?.first_name} {item?.last_name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      theme.name === 'dark'
                        ? checked.includes(item?._id)
                          ? theme.secondary
                          : 'black'
                        : checked.includes(item?._id)
                        ? theme.secondary
                        : 'grey',
                    paddingHorizontal: 10,
                    height: 25,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => toggleCheck(item, index)}>
                  <Text style={{color: 'white'}}>
                    {checked.includes(index) ? 'Invite' : 'Invite'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : (
        <WatchPartyGuide />
      )}
      <TouchableOpacity
        onPress={handleInvitePress}
        disabled={checked.length == 0 ? true : false}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          left: 30,
          backgroundColor: checked.length == 0 ? 'grey' : theme.secondary,
          borderRadius: 8,
          width: width - 60,
          height: 45,
          //flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'white', fontSize: 16, padding: 10}}>
          {guidCheck ? 'Invite' : 'Start FunParty'}
        </Text>
      </TouchableOpacity>
      <Menu ref={refRBSheetFarward} />
    </SafeAreaView>
  );
};

export default FunPartyInvite;

const styles = StyleSheet.create({
  flexStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {flex: 1},
  inviteUser: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  userInfo: {
    width: 30,
    height: 30,
    borderRadius: 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
