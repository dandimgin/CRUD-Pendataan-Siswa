import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native";

export default function IndexPage() {
    const [name, setName] = useState("");
    const [kelas, setKelas] = useState("");
    const [age, setAge] = useState("");

    async function storeData() {
        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("kelas", kelas);
        await AsyncStorage.setItem("age", age);
}

    async function removeData() {
        await AsyncStorage.removeItem("name");
        await AsyncStorage.removeItem("kelas");
        await AsyncStorage.removeItem("age");

        setName("");
        setKelas("");
        setAge("");      
}

    async function getData() {
        const nameValue = await AsyncStorage.getItem("name");
        const kelasValue = await AsyncStorage.getItem("kelas");
        const ageValue = await AsyncStorage.getItem("age");

        if (nameValue !== null) setName(nameValue);
        if (kelasValue !== null) setKelas(kelasValue);
        if (ageValue !== null) setAge(ageValue);
    }

    useEffect(() =>{
        getData();
    }, []);

    return (
        <SafeAreaView>
            <Text>Name: {name} </Text>
            <Text>Kelas: {kelas} </Text>
            <Text>Umur: {age} </Text>
            
            <TextInput placeholder="Masukan Nama" onChangeText={setName} />
            <TextInput placeholder="Masukan Kelas" onChangeText={setKelas} />
            <TextInput placeholder="Masukan Umur" onChangeText={setAge} />
            
            <Button title="Simpan" onPress={storeData}/>
            <Button title="Hapus" onPress={removeData}/>
            <Button title="Ambil" onPress={getData}/>
        </SafeAreaView>
    )
}