import React from 'react'
import {
  View,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native'


export default function InputFields(props) {
    const { name, label, value, labelStyle, onChange, output, ...inputProps } = props

    return (
      <View style={styles.fieldsContainer}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <TextInput
          autoCapitalize="none"
          style={styles.inputField}
          name={name}
          value={value}
          onChangeText={onChange}
          keyboardType='numeric'
          {...inputProps}
        />
        <Text style={styles.output}>{output ? output : null}</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    fieldsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
    },
    label: {
      fontSize: 20,
      flexBasis: 100,
      color: '#000',
      fontWeight: '500'
    },
    inputField: {
      borderColor: '#c0cbd3',
      borderWidth: 1,
      width: 120,
      textAlign: 'center',
      fontSize: 20,
      color: '#000'
    },
    output: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        flexBasis: 80,
        color: '#000'
    }
  })
  