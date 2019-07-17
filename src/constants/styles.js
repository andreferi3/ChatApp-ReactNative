import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    backgroundGradient: {
        height:'100%', 
        width:'100%', 
        paddingHorizontal:30
    },
    container: {
        flex:1
    },
    containerImage: {
        justifyContent:'center', 
        flexDirection:'row'
    },
    imageSize: {
        width:200, 
        height:200
    },
    textLogo: {
        fontSize:30, 
        textAlign:'center', 
        color:'#f1f1f1', 
        marginTop:-30, 
        marginBottom:20, 
        fontFamily:'sans-serif-medium'
    },
    textInput: {
        backgroundColor:'#f1f1f1', 
        borderRadius:20, 
        paddingLeft:20, 
        elevation:10
    },
    flexRow: {
      flexDirection:'row'
    },
    whiteText: {
      color:'#fff'
    },
    f1Text: {
      color:'#f1f1f1'
    },
    iconLogin: {
      width:35, 
      height:35, 
      marginLeft:15
    },
    googleLogin: {
      backgroundColor:'#fff', 
      padding:7, 
      borderRadius:50, 
      marginLeft:10
    },
    imageSizeSm: {
      width:20, 
      height:20
    },
    footer: {
      flex:1,
      justifyContent:'flex-end', 
      alignItems:'center'
    },
    footerText: {
      color:'#f1f1f1', 
      marginBottom:10, 
      fontFamily:'sans-serif-medium'
    },
    textButton: {
      paddingVertical:8 ,
      textAlign:'center', 
      letterSpacing:2, 
      fontSize:22, 
      color:'#6f86d6', 
      fontWeight:'700', 
      backgroundColor:'#f1f1f1', 
      borderRadius:20, 
      elevation:10
    },
    button: {
      flex:0.5, 
      marginTop:20
    }
});

export default styles;