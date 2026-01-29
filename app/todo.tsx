import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  Surface,
  TextInput,
  List,
  Checkbox,
  Button,
  Dialog,
  Portal,
} from "react-native-paper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");

  async function loadTodos() {
    const storedTodos = await AsyncStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    loadTodos();
  }, []);

  async function AddTodo() {
    const newTodo: Todo = {
      id: Math.random().toString(),
      title: input,
      completed: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setInput("");
    await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

    async function deleteTodo(id: string) {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    }

    async function toggleTodo(id: string) {
        const updatedTodos = todos.map((todo) =>
            todo.id == id? {...todo, completed: !todo.completed } : todo,
        );
        setTodos(updatedTodos);
        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    }

    if(loading){
        return (
            <View 
            style={{
              backgroundColor: 'white', 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center'
            }}
         >
          <Text>Loading...</Text>
         </View>
        );
  }
  
  async function saveEdit() {
    if (editId == null) return;{
      const updatedTodos = todos.map((todo) =>
        todo.id === editId ? { ...todo, title: editInput } : todo
      );

      setTodos(updatedTodos);
      setVisible(false);
      setEditId(null);
      setEditInput("");
      await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    }
  }
  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.BackAction />
        <Appbar.Content title="Todo" />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 16 }}>
        <Surface style={{ padding: 16, elevation: 4, borderRadius: 12 }}>
          <TextInput
            label={"Add Todo"}
            value={input}
            onChangeText={setInput}
            mode="outlined"
            right={
              <TextInput.Icon
                icon="plus"
                onPress={AddTodo}
              />
            }
          />
        </Surface>

        <ScrollView>
            {todos.map((todo) => (
                 <Surface 
                 key={todo.id}
                 style={{ marginBottom: 12, elevation: 1, borderRadius: 12 }}
                 >
            <List.Item
              title={() => <Text style={todo.completed ? { textDecorationLine: "line-through" } : {}}>{todo.title}</Text>}
              left={() => <Checkbox status={todo.completed ? "checked" : "unchecked"} />}
              onPress={() => toggleTodo(todo.id)}
              right={() => (
              <View>
                <Button compact onPress={() => {deleteTodo(todo.id);

                }}>
                  Delete
                  </Button>
                  <Button onPress={() => {
                    setEditId(todo.id);
                    setVisible(true);
                  }}> Edit</Button>
              </View>
              )}
            />
          </Surface>
            ))}
         
        </ScrollView>
      </View>

      <Portal>
        <Dialog visible= {visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Edit Todo</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Todo" mode="outlined" value={editInput} onChangeText={setEditInput}/>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={saveEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}