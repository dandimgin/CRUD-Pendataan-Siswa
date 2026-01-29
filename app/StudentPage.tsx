import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  Surface,
  TextInput,
  List,
  Button,
  Dialog,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Student = {
  id: string;
  name: string;
  kelas: string;
  jurusan: string;
};

const KELAS = ["X", "XI", "XII"];
const JURUSAN = ["TJKT", "PPLG", "BRF", "ANIMASI", "TEI", "DKV"];

function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // ADD
  const [name, setName] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");

  // EDIT
  const [editVisible, setEditVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editKelas, setEditKelas] = useState("");
  const [editJurusan, setEditJurusan] = useState("");

  // DROPDOWN
  const [kelasDialog, setKelasDialog] = useState(false);
  const [jurusanDialog, setJurusanDialog] = useState(false);
  const [editKelasDialog, setEditKelasDialog] = useState(false);
  const [editJurusanDialog, setEditJurusanDialog] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const data = await AsyncStorage.getItem("students");
    if (data) setStudents(JSON.parse(data));
    setLoading(false);
  }

  async function saveStorage(data: Student[]) {
    setStudents(data);
    await AsyncStorage.setItem("students", JSON.stringify(data));
  }

  async function addStudent() {
    if (!name || !kelas || !jurusan) return;

    const newStudent: Student = {
      id: Math.random().toString(),
      name,
      kelas,
      jurusan,
    };

    saveStorage([...students, newStudent]);
    setName("");
    setKelas("");
    setJurusan("");
  }

  async function deleteStudent(id: string) {
    saveStorage(students.filter((s) => s.id !== id));
  }

  function openEdit(s: Student) {
    setEditId(s.id);
    setEditName(s.name);
    setEditKelas(s.kelas);
    setEditJurusan(s.jurusan);
    setEditVisible(true);
  }

  async function saveEdit() {
    if (!editId) return;

    const updated = students.map((s) =>
      s.id === editId
        ? { ...s, name: editName, kelas: editKelas, jurusan: editJurusan }
        : s
    );

    saveStorage(updated);
    setEditVisible(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Pendataan Siswa" />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 16 }}>
        {/* ADD FORM */}
        <Surface style={{ padding: 16, borderRadius: 12, elevation: 4 }}>
          <TextInput
            label="Nama Siswa"
            value={name}
            onChangeText={setName}
            mode="outlined"
          />

          <Pressable onPress={() => setKelasDialog(true)}>
            <View pointerEvents="none">
              <TextInput
                label="Kelas"
                value={kelas}
                mode="outlined"
                style={{ marginTop: 8 }}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </View>
          </Pressable>

          <Pressable onPress={() => setJurusanDialog(true)}>
            <View pointerEvents="none">
              <TextInput
                label="Jurusan"
                value={jurusan}
                mode="outlined"
                style={{ marginTop: 8 }}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </View>
          </Pressable>

          <Button mode="contained" onPress={addStudent} style={{ marginTop: 12 }}>
            Tambah Siswa
          </Button>
        </Surface>

        <ScrollView>
          {students.map((s) => (
            <Surface key={s.id} style={{ marginBottom: 12, borderRadius: 12 }}>
              <List.Item
                title={s.name}
                description={`${s.kelas} • ${s.jurusan}`}
                right={() => (
                  <View>
                    <Button compact onPress={() => deleteStudent(s.id)}>
                      Delete
                    </Button>
                    <Button onPress={() => openEdit(s)}>Edit</Button>
                  </View>
                )}
              />
            </Surface>
          ))}
        </ScrollView>
      </View>

      <Portal>
        <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
          <Dialog.Title>Edit Siswa</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nama"
              value={editName}
              onChangeText={setEditName}
              mode="outlined"
            />

            <Pressable onPress={() => setEditKelasDialog(true)}>
              <View pointerEvents="none">
                <TextInput
                  label="Kelas"
                  value={editKelas}
                  mode="outlined"
                  style={{ marginTop: 8 }}
                  right={<TextInput.Icon icon="chevron-down" />}
                />
              </View>
            </Pressable>

            <Pressable onPress={() => setEditJurusanDialog(true)}>
              <View pointerEvents="none">
                <TextInput
                  label="Jurusan"
                  value={editJurusan}
                  mode="outlined"
                  style={{ marginTop: 8 }}
                  right={<TextInput.Icon icon="chevron-down" />}
                />
              </View>
            </Pressable>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditVisible(false)}>Cancel</Button>
            <Button onPress={saveEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={kelasDialog} onDismiss={() => setKelasDialog(false)}>
          <Dialog.Title>Pilih Kelas</Dialog.Title>
          {KELAS.map((k) => (
            <List.Item key={k} title={k} onPress={() => { setKelas(k); setKelasDialog(false); }} />
          ))}
        </Dialog>

        <Dialog visible={jurusanDialog} onDismiss={() => setJurusanDialog(false)}>
          <Dialog.Title>Pilih Jurusan</Dialog.Title>
          {JURUSAN.map((j) => (
            <List.Item key={j} title={j} onPress={() => { setJurusan(j); setJurusanDialog(false); }} />
          ))}
        </Dialog>

        {/* EDIT DROPDOWN (FILTERED) */}
        <Dialog visible={editKelasDialog} onDismiss={() => setEditKelasDialog(false)}>
          <Dialog.Title>Ganti Kelas</Dialog.Title>
          {KELAS.filter(k => k !== editKelas).map((k) => (
            <List.Item key={k} title={k} onPress={() => { setEditKelas(k); setEditKelasDialog(false); }} />
          ))}
        </Dialog>

        <Dialog visible={editJurusanDialog} onDismiss={() => setEditJurusanDialog(false)}>
          <Dialog.Title>Ganti Jurusan</Dialog.Title>
          {JURUSAN.filter(j => j !== editJurusan).map((j) => (
            <List.Item key={j} title={j} onPress={() => { setEditJurusan(j); setEditJurusanDialog(false); }} />
          ))}
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <StudentPage />
    </PaperProvider>
  );
}
