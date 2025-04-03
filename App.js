import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";

const App = () => {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");
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
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <View style={styles.titleSpacing} />
      <Text style={styles.title}>Meeting Attendance</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={newName}
          onChangeText={(text) => {
            setNewName(text);
            setErrorMessage("");
          }}
          onSubmitEditing={addName}
        />
        <TouchableOpacity style={styles.addButton} onPress={addName}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <FlatList
        data={names}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {/* ✅ Custom Styled Grey Checkbox */}
            <TouchableOpacity
              style={[
                styles.checkbox,
                item.present && styles.checkedCheckbox,
              ]}
              onPress={() => toggleAttendance(item.id)}
            >
              {item.present && <Text style={styles.checkmark}>✔</Text>}
            </TouchableOpacity>

            {editId === item.id ? (
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                autoFocus
              />
            ) : (
              <Text style={[styles.nameText, styles.centerText, item.present && styles.present]}>
                {item.name}
              </Text>
            )}

            <View style={styles.actions}>
              {editId === item.id ? (
                <TouchableOpacity onPress={saveEdit} style={[styles.actionButton, styles.save]}>
                  <Text style={styles.buttonText}>💾</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => startEdit(item)} style={[styles.actionButton, styles.edit]}>
                  <Text style={styles.buttonText}>✏️</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deleteName(item.id)} style={[styles.actionButton, styles.delete]}>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  titleSpacing: {
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  /* ✅ Grey "Add" Button */
  addButton: {
    backgroundColor: "#ccc", // Grey color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#000", // Black text instead of white
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nameText: {
    fontSize: 16,
    flex: 1,
  },
  /* ✅ Center align names */
  centerText: {
    textAlign: "center",
  },
  present: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 5,
    borderRadius: 4,
    padding: 5,
  },
  edit: { color: "#2196F3" },
  save: { color: "#4CAF50" },
  delete: { color: "#F44336" },
  buttonText: {
    fontSize: 16,
  },
  summary: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },
  /* ✅ Custom Grey Checkbox Styling */
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCheckbox: {
    borderColor: "#888",
  },
  checkmark: {
    color: "#888",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4, // 👈 Added this to center it better
  },

});

export default App;
