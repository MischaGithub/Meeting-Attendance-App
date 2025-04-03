import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const App = () => {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to add a new name to the list
  const addName = () => {
    if (newName.trim() === "") {
      setErrorMessage("Please enter a name.");
      return;
    }

    setNames([
      ...names,
      { id: Date.now().toString(), name: newName.trim(), present: false },
    ]);

    setNewName("");
    setErrorMessage(""); // Clear error message on successful add
  };

  const deleteName = (id) => {
    setNames(names.filter((item) => item.id !== id));
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditName(item.name);
  };

  const saveEdit = () => {
    setNames(
      names.map((item) =>
        item.id === editId ? { ...item, name: editName.trim() } : item
      )
    );
    setEditId(null);
    setEditName("");
  };

  const toggleAttendance = (id) => {
    setNames(
      names.map((item) =>
        item.id === id ? { ...item, present: !item.present } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meeting Attendance</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={newName}
          onChangeText={(text) => {
            setNewName(text);
            setErrorMessage(""); // Remove error when user starts typing
          }}
          onSubmitEditing={addName} // Adds on pressing enter (on keyboard)
        />
        <TouchableOpacity style={styles.addButton} onPress={addName}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <FlatList
        data={names}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => toggleAttendance(item.id)}>
              <Text style={[styles.nameText, item.present && styles.present]}>
                {editId === item.id ? (
                  <TextInput
                    style={styles.editInput}
                    value={editName}
                    onChangeText={setEditName}
                    autoFocus
                  />
                ) : (
                  item.name
                )}
              </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              {editId === item.id ? (
                <TouchableOpacity onPress={saveEdit} style={styles.saveButton}>
                  <Text style={styles.buttonText}>💾</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => startEdit(item)} style={styles.editButton}>
                  <Text style={styles.buttonText}>✏️</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deleteName(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.summary}>
        Present: {names.filter((item) => item.present).length} / {names.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  nameText: {
    fontSize: 16,
  },
  present: {
    textDecorationLine: "line-through",
    color: "green",
  },
  actions: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  saveButton: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  editInput: {
    borderBottomWidth: 1,
    borderColor: "#000",
    fontSize: 16,
  },
  summary: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default App;
