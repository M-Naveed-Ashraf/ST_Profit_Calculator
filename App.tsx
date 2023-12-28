import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputFields from './components/input'
import AsyncStorage from '@react-native-async-storage/async-storage'

const screenHeight = Dimensions.get('window').height

const App = () => {

  const [netWeight, setNetWeight] = useState('')
  const [sales, setSales] = useState('')
  const [purchase, setPurchase] = useState('')
  const [packingWeight, setPackingWeight] = useState('')
  const [dozen, setDozen] = useState('')
  const [rate, setRate] = useState('')
  const [output1, setOutput1] = useState('0.0')
  const [output2, setOutput2] = useState('0.0')
  const [totalRate, setTotalRate] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [percentage, setPercentage] = useState(0)

  const getData = async () => {
    try {
      const netWeightStore = await AsyncStorage.getItem('net-weight')
      if(netWeightStore !== null) {
        setNetWeight(netWeightStore)
      }
      const rateStore = await AsyncStorage.getItem('rate')
      if(rateStore !== null) {
        setRate(rateStore)
      }
      const dozenStore = await AsyncStorage.getItem('dozen')
      if(dozenStore !== null) {
        setDozen(dozenStore)
      }
      const packingWeightStore = await AsyncStorage.getItem('packing-weight')
      if(packingWeightStore !== null) {
        setPackingWeight(packingWeightStore)
      }
      const salesStore = await AsyncStorage.getItem('sales')
      if(salesStore !== null) {
        setSales(salesStore)
      }
      const purchaseStore = await AsyncStorage.getItem('purchase')
      if(purchaseStore !== null) {
        setPurchase(purchaseStore)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if(!rate) {
      setOutput1('0.0')
      setOutput2('0.0')
    }
    if(rate && dozen && packingWeight && sales) {
      const tempOutput1 = ((rate / 12) - packingWeight) * 1000/sales
      console.log(tempOutput1.toFixed(2))
      setOutput1(tempOutput1.toFixed(2))
    }
    if(rate && dozen && packingWeight && netWeight) {
      const tempOutput2 = ((rate / 12) - packingWeight) * 1000/netWeight
      console.log(tempOutput2.toFixed(2))
      setOutput2(tempOutput2.toFixed(2))
    }
    
    if(sales && dozen && packingWeight && netWeight) {
      const tempTotalRate = (((sales/1000 * netWeight) + parseFloat(packingWeight)) * (dozen * 12)).toFixed(2)
      console.log(tempTotalRate)
      setTotalRate(tempTotalRate)
      if(purchase) {
        const tempTotalProfit = tempTotalRate - (((purchase/1000 * netWeight) + parseFloat(packingWeight)) * (dozen * 12))
        console.log(tempTotalProfit.toFixed(2))
        setTotalProfit(tempTotalProfit.toFixed(2))
      }
    }
  }, [rate, dozen, packingWeight, sales, netWeight, purchase])

  useEffect(() => {
    if(totalProfit && totalRate) {
      const prcntg = (totalProfit/totalRate)*100
      setPercentage(Math.round(prcntg))
    }
  }, [totalProfit, totalRate])

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', height: '100%' }}>
      <ScrollView style={{ backgroundColor: 'gray' }}>
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.headerText}>ST Profit Calculator</Text>
          </View>
          <View style={styles.formContainer}>
            <InputFields 
              name='netWeight' 
              label='Net Weight' 
              value={netWeight} 
              onChange={(val) => {
                console.log("🚀 ~ file: App.tsx:105 ~ App ~ val:", val)
                setNetWeight(val)
                !val ? 
                  AsyncStorage.removeItem('net-weight') 
                : 
                  AsyncStorage.setItem('net-weight', val)
              }} 
              output={output1}
            />
            <InputFields 
              name='sales' 
              label='Sales per KG' 
              value={sales}
              onChange={(val) => {
                console.log("🚀 ~ file: App.tsx:118 ~ App ~ val:", val)
                setSales(val)
                !val ?
                  AsyncStorage.removeItem('sales')
                :
                  AsyncStorage.setItem('sales', val)
              }} 
              output={output2}
            />
            <InputFields 
              name='purchase' 
              label='Purchase per KG' 
              value={purchase}
              onChange={(val) => {
                console.log("🚀 ~ file: App.tsx:131 ~ App ~ val:", val)
                setPurchase(val)
                !val ?
                  AsyncStorage.removeItem('purchase')
                :
                  AsyncStorage.setItem('purchase', val)
              }} 
            />
            <InputFields 
              name='packingWeight' 
              label='Packing weight' 
              value={packingWeight}
              onChange={(val) => {
                console.log("🚀 ~ file: App.tsx:143 ~ App ~ val:", val)
                setPackingWeight(val)
                !val ?
                  AsyncStorage.removeItem('packing-weight')
                :
                  AsyncStorage.setItem('packing-weight', val)
              }}
            />
            <InputFields 
              name='dozen' 
              label='Dozen' 
              value={dozen}
              onChange={(val) => {
                console.log("🚀 ~ file: App.tsx:155 ~ App ~ val:", val)
                setDozen(val)
                !val ?
                  AsyncStorage.removeItem('dozen')
                :
                  AsyncStorage.setItem('dozen', val)
              }} 
            />
            <InputFields 
              name='rate' 
              label='Input Rate/dzn' 
              value={rate}
              onChange={(val) => {
                console.log("🚀 ~ file: App.tsx:167 ~ App ~ val:", val)
                setRate(val)
                !val ?
                  AsyncStorage.removeItem('rate')
                :
                  AsyncStorage.setItem('rate', val)
              }} 
            />
          </View>
          <View>
            <View style={[styles.fieldsContainer, {marginTop: 40, backgroundColor: '#E36414'}]}>
              <Text style={styles.label}>Total Rate/dzn</Text>
              <Text style={styles.label}>{totalRate ? totalRate : 0}</Text>
            </View>
            <View style={[styles.fieldsContainer, {backgroundColor: 'green'}]}>
              <Text style={styles.label}>Total Profit</Text>
              <Text style={styles.label}>{percentage} %</Text>
              <Text style={styles.label}>{totalProfit ? totalProfit : 0}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    alignContent: 'space-between',
    backgroundColor:'white',
    height: screenHeight,
  },
  header: {
    flex: 1,
    backgroundColor: '#219ebc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: '#FFF'
  },
  formContainer: {
    gap: 10,
    margin: 20,
    marginTop: 60,
    flex: 4,
    alignSelf: 'stretch',
    alignContent: 'center',
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    padding: 20
  },
  label: {
    fontSize: 20,
    color: '#000',
    fontWeight: '500'
  },
  inputField: {
    borderColor: '#fff',
    borderWidth: 1,
    width: 150
  },
})

export default App