/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import GridView from 'react-native-super-grid';
import { Fonts } from './src/utils/Fonts';
import AwesomeButton from 'react-native-really-awesome-button/src/themes/rick';
import AwesomeAlert from 'react-native-awesome-alerts';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from './src/selection.json';
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

coinAvailable = {
 tenBath:5,
 fiveBath:10,
 twoBath:3,
 oneBath:10
}

coindrop = {
  tenBath:0,
  fiveBath:0,
  twoBath:0,
  oneBath:0
 }

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { dataSource: {} ,
                   isLoading: true,
                   wallet: 0.00,
                   showAlert: false,
                   showAlertError: false,
                   changes: 0,
                   itemName: '',
                   coin10bath: 0,
                   coin5bath: 0,
                   coin2bath: 0,
                   coin1bath: 0,
                   saleFail: false
                }
    
  } 

  componentDidMount(){
    return fetch('http://www.mocky.io/v2/5af11f8c3100004d0096c7ed')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.data,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }
  showAlert = () => {
    this.setState({
      showAlert: true
    });
  }
  
  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  }

  showAlertError = () => {
    this.setState({
      showAlertError: true
    });
  }
  
  hideAlertError = () => {
    this.setState({
      showAlertError: false
    });
  }

  dismissScaleAnimationDialog = () => {
    this.popupDialog.dismiss();
  }

  calculateChangeCoins (change) {
    var coin10 = 0;
    var coin5 = 0;
    var coin2 = 0;
    var coin1 = 0;
    while ( change > 0){
      if(change >= 10 && coin10 < coinAvailable.tenBath){
        coin10++;
        change= change-10;
        }
      else if(change >= 5 && coin5 < coinAvailable.fiveBath){
        coin5++;
        change= change-5;
      }
      else if(change >= 2 && coin2 < coinAvailable.twoBath){
        coin2++;
        change = change-2;
      } 
      else if(change >= 1 && coin1 < coinAvailable.oneBath) {
        coin1++;
        change--;
    }else{
      this.setState({
        saleFail: true
        })
        break;
    }
  }

  if(!this.state.saleFail){
  coinAvailable.tenBath = coinAvailable.tenBath - coin10;
  coinAvailable.fiveBath = coinAvailable.fiveBath - coin5;
  coinAvailable.twoBath = coinAvailable.twoBath - coin2;
  coinAvailable.oneBath = coinAvailable.oneBath - coin1;

  this.setState({
    coin10bath: coin10,
    coin5bath: coin5,
    coin2bath: coin2,
    coin1bath: coin1
    })
  }
}

  renderItem(item){
    return(
    <View style = {styles.cardviewcontent}>
    <View style = {{ padding: 5}}>
      <Image 
        resizeMode = "contain"
        style={styles.imageItems}
        source={{uri: item.image}}></Image>
        <Text style={styles.textname}>{item.name}</Text>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between',paddingHorizontal: 6 }}>
        <View style = {{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center'}}>
          <Icon name="usd-circle" style={{ alignSelf:'center', paddingTop: 2}} size={15} color = '#3d3d3d' />
          { this.state.wallet >= item.price ? <Text style={styles.textprice}>{item.price} B</Text> :
          <Text style={styles.textpricecannotbuy}>{item.price} B</Text> }
        </View>
          <View style = {{flexDirection: 'row', alignItems: 'baseline'}}>
          {item.in_stock === true ? <View style={styles.viewStatecircleAvailale}/> :
          <View style={styles.viewStatecircleunAvailale}/> }
          {item.in_stock === true ? <Text style = {styles.textAvailable}>Available</Text> : 
          <Text style = {styles.textunAvailable}>Unavailable</Text> }
          </View>
        </View>
        {this.renderAwesomeButton (item.in_stock,item.price,item.name)}
        </View>
    </View>
    )
  }

  renderAwesomeButton (state,price,itemName) {
      if(state === true && this.state.wallet >= price){
        return (
          <AwesomeButton
          progress
          textColor = '#fff'
          style = {styles.awesomeButton}
          width={100}
          height = {40}
          onPress={(next) => setTimeout(() => { next()
          const changes = this.state.wallet - price;
          this.setState({
            wallet: 0,
            itemName: itemName,
            changes: changes,
          })
          if(changes > 0){
            this.calculateChangeCoins(this.state.changes);
          }

          if (this.state.saleFail){
            this.showAlertError();
          }else{
            coinAvailable.tenBath = coinAvailable.tenBath + coindrop.tenBath;
            coinAvailable.fiveBath = coinAvailable.fiveBath + coindrop.fiveBath;
            coinAvailable.twoBath = coinAvailable.twoBath + coindrop.twoBath;
            coinAvailable.oneBath = coinAvailable.oneBath + coindrop.oneBath;
            this.showAlert();
          }
          }, 700)}
          type="anchor"
          >
          Buy
        </AwesomeButton>
        );
      }else{
        return (
          <AwesomeButton
          progress
          style = {styles.awesomeButton}
          width={100}
          height = {40}
          disabled>
          Buy
        </AwesomeButton> 
        )
      }
  }

  render() {
    const {showAlert, showAlertError, itemName, changes ,coin10bath, coin5bath, coin2bath, coin1bath} = this.state;
    if(this.state.isLoading){
      return(
        <View style={styles.ActivityIndicatorLoading}>
          <ActivityIndicator/>
        </View>
      )
    }

    if (Platform.OS === 'ios'){
      return (
        <SafeAreaView>
        <ScrollView
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.scrollY } } }]
                  )}>
          <GridView
              itemDimension={SCREEN_WIDTH * 0.43}
              items={this.state.dataSource}
              style={styles.gridView}
              spacing = {0}
              renderItem={item => (this.renderItem(item))}
              />
          </ScrollView>
        </SafeAreaView>
      );
    }else{
      return (
        <View style={styles.container}>
          <ScrollView
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.scrollY } } }]
                  )}>
          <View style = {styles.cardviewMywallet}>
            <Text style={styles.myWallettext}>Mywallet (THB)</Text>
            <Text style={styles.moneyText}>{this.state.wallet}</Text>
            <AwesomeButton
            style = {styles.addcoinButton}
            type="anchor"
            width={150}
            height = {50}
            onPress={() => {this.popupDialog.show();}}
            >
            Add Coin
          </AwesomeButton> 

          <Text>current coin</Text>
          <Text>10: {coinAvailable.tenBath}</Text>
          <Text>5: {coinAvailable.fiveBath}</Text>
          <Text>2: {coinAvailable.twoBath}</Text>
          <Text>1: {coinAvailable.oneBath}</Text>
          </View>
          <GridView
              itemDimension={SCREEN_WIDTH * 0.43}
              items={this.state.dataSource}
              style={styles.gridView}
              spacing = {0}
              renderItem={item => (this.renderItem(item))}
              />
          </ScrollView>
          <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Success"
          message={"Item: " +itemName+ "\nChange: " +changes+ " THB\nCoin 10 Bath: " 
          +coin10bath+" ea\nCoin 5 Bath: "+coin5bath+" ea\nCoin 2 Bath: "+coin2bath+" ea\nCoin 1 Bath: "+coin1bath+" ea"}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#05c46b"
          messageStyle = {styles.messageawesomeAlert}
          titleStyle = {styles.titleawesomeAlert}
          confirmButtonTextStyle = {styles.confirmAwesomeButtonAlert}
          contentContainerStyle = {{width:300}}
          onConfirmPressed={() => {
            this.hideAlert();
            coindrop.tenBath = 0;
            coindrop.fiveBath = 0;
            coindrop.twoBath = 0;
            coindrop.oneBath = 0;
            this.setState({
            coin10bath: 0,
            coin5bath: 0,
            coin2bath: 0,
            coin1bath: 0
        })
          }}
        />
        <AwesomeAlert
          show={showAlertError}
          showProgress={false}
          title="Error"
          message="Don't have coin enough for changes"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#05c46b"
          messageStyle = {styles.messageawesomeAlert}
          titleStyle = {styles.titleawesomeAlert}
          confirmButtonTextStyle = {styles.confirmAwesomeButtonAlert}
          contentContainerStyle = {{width:300}}
          onConfirmPressed={() => {
            this.hideAlertError();
            coindrop.tenBath = 0;
            coindrop.fiveBath = 0;
            coindrop.twoBath = 0;
            coindrop.oneBath = 0;
            this.setState({
            coin10bath: 0,
            coin5bath: 0,
            coin2bath: 0,
            coin1bath: 0,
            saleFail: false
        })
          }}
        />
          <PopupDialog
          dialogTitle={<DialogTitle titleTextStyle = {styles.textname} title="Choose coin for add to your wallet" />}
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          dismissOnTouchOutside = {false}
          width = {300}
          height = {420}>
          <View style = {{alignItems: 'center', paddingBottom: 10}}>
          <AwesomeButton
            style = {styles.addcoinButton}
            type="anchor"
            width={150}
            height = {50}
            onPress= {() =>{
                this.setState({
                wallet: this.state.wallet +10
              })
              coindrop.tenBath++;
            }}
            >
            10 Bath
          </AwesomeButton>
          <AwesomeButton
            style = {styles.addcoinButton}
            type="anchor"
            width={150}
            height = {50}
            onPress= {() =>{
                this.setState({
                wallet: this.state.wallet +5
              })
              coindrop.fiveBath++;
            }}
            >
            5 Bath
          </AwesomeButton> 
          <AwesomeButton
            style = {styles.addcoinButton}
            type="anchor"
            width={150}
            height = {50}
            onPress= {() =>{
                this.setState({
                wallet: this.state.wallet +2
              })
              coindrop.twoBath++;
            }}
            >
            2 Bath
          </AwesomeButton> 
          <AwesomeButton
            style = {styles.addcoinButton}
            type="anchor"
            width={150}
            height = {50}
            onPress= {() =>{
                this.setState({
                wallet: this.state.wallet +1
              })
              coindrop.oneBath++;
            }}
            >
            1 Bath
          </AwesomeButton> 
          </View>
          <DialogButton
            text="Dismiss"
            textStyle = {{fontSize: 25, fontFamily: Fonts.ChelaOne_Regular}}
            onPress={this.dismissScaleAnimationDialog}
          />
        </PopupDialog>
        </View>
      );
    }
  }
}

const SCREEN_WIDTH = Dimensions.get("window").width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
  },
  ActivityIndicatorLoading:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  cardviewcontent:{ 
    flex: 1, 
    overflow: 'hidden',
    borderRadius: 10,
    shadowOffset: {width: 4, height: 4},
    shadowColor: '#000000', 
    shadowOpacity : 0.24, 
    shadowRadius: 3, 
    backgroundColor: '#ffffff', 
    borderRadius: 5, 
    elevation: 3,
    marginTop:6,
    marginLeft:6,
    marginRight: 6,
    marginBottom: 6
  },
  cardviewMywallet:{
    overflow: 'hidden',
    margin: 20,
    borderRadius: 10,
    shadowOffset: {width: 4, height: 4},
    shadowColor: '#000000', 
    shadowOpacity : 0.24, 
    shadowRadius: 3, 
    backgroundColor: '#17c0eb', 
    borderRadius: 5, 
    elevation: 3,
    padding: 15,
    alignItems: 'center'
  },
  gridView: {
    flex: 1,
    marginLeft: 3,
    marginRight: 3
  },
  imageItems:{
    width: SCREEN_WIDTH * 0.43, 
    height: SCREEN_WIDTH * 0.43, 
    alignSelf:'center'
  },
  textname: {
    paddingHorizontal: 6, 
    fontSize: 18, 
    fontFamily: Fonts.ChelaOne_Regular,
    color: '#2c3e50'
  },
  textprice: {
    fontSize: 18, 
    fontFamily: Fonts.ChelaOne_Regular,
    color: '#2ecc71',
    marginLeft: 5
  },
  textpricecannotbuy:{
    fontSize: 18, 
    fontFamily: Fonts.ChelaOne_Regular,
    color: '#c0392b',
    marginLeft: 5
  },
  textAvailable:{
    fontFamily: Fonts.Itim_Regular,
    fontSize: 17,
    color: '#2ecc71',
    paddingLeft: 5,
    alignSelf: 'center'
  },
  textunAvailable:{
    fontFamily: Fonts.Itim_Regular,
    fontSize: 17, 
    color: '#e74c3c',
    paddingLeft: 5,
    alignSelf: 'center'
  },
  viewStatecircleAvailale:{ 
    backgroundColor: '#2ce018', 
    width: 10, 
    height: 10, 
    borderRadius: 6, 
    alignSelf: 'center'
  },
  viewStatecircleunAvailale:{ 
    backgroundColor: '#e74c3c', 
    width: 10, 
    height: 10, 
    borderRadius: 6, 
    alignSelf: 'center'
  },
  awesomeButton:{
    alignSelf: 'center', 
    marginTop: 10
  },
  addcoinButton:{
    marginTop: 20
  },
  messageawesomeAlert:{
    fontFamily: Fonts.ChelaOne_Regular,
    color: '#2f3640', 
    fontSize: 25 
  },
  titleawesomeAlert:{
    fontFamily: Fonts.ChelaOne_Regular,
    color: '#2f3640', 
    fontSize: 30 
  },
  confirmAwesomeButtonAlert:{
    fontFamily: Fonts.ChelaOne_Regular, 
    textAlign: 'center',
    color: '#fff', 
    fontSize: 20 
  },
  myWallettext:{
    fontFamily: Fonts.ChelaOne_Regular, 
    fontSize: 25, 
    color: '#fff'
  },
  moneyText:{
    fontFamily: Fonts.ChelaOne_Regular, 
    fontSize: 40, 
    color: '#fff'
  },
});
