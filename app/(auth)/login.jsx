import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const login = () => {
  return (
    <View style={styles.login}>
      <Text>login</Text>
    </View>
  )
}

export default login

const styles = StyleSheet.create({
    login: {
        padding:20,
        marginTop:20,
        marginLeft:20
    }
})