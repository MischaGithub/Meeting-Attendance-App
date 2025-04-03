import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const App = () => {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [keyboardDismissed, setKeyboardDismissed] = useState(false); // Track if keyboard was dismissed

  const addName = () => {
    if (newName.trim() === "") {
      setErrorMessage("Please enter a name.");
      return;
    }

    setNames((prevNames) => [
      ...prevNames,
      { id: Date.now().toString(), name: newName.trim(), present: false },
    ]);

    setNewName("");
    setErrorMessage("");

    // Dismiss the keyboard only on the first click
    if (!keyboardDismissed) {
      Keyboard.dismiss();
      setKeyboardDismissed(true); // Prevent dismissing on next adds
    }

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
          <Text style={styles.title}>Meeting Attendance</Text>

          <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={newName}
              onChangeText={(text) => {
                if (text !== newName) setNewName(text);
                setErrorMessage("");
              }}
              onSubmitEditing={() => {
                addName(); // Add the name
                Keyboard.dismiss(); // Hide the keyboard
              }}
              blurOnSubmit={true} // Ensure keyboard hides on Enter
              returnKeyType="done" // Shows 'Done' button on iOS
            />


            <TouchableOpacity style={styles.addButton} onPress={addName}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          {/* ✅ Scrollable List Instead of FlatList */}
          {names.map((item) => (
            <View key={item.id} style={styles.listItem}>
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
                <Text style={[styles.nameText, item.present && styles.present]}>
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
          ))}

          <Text style={styles.summary}>
            Present: {names.filter((item) => item.present).length} / {names.length}
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    alignItems: "center",
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
    marginTop: -5,  // Slightly moves it up
    marginBottom: 10,
    textAlign: "left",
    alignSelf: "flex-start",  // Aligns with the input field
    marginLeft: 5,  // Slightly indents for better alignment
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
    color: "#333", // Make sure text is visible
    textAlign: "left",  // Ensures text starts from the left
  },
  addButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#000",
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
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1, // Ensures proper spacing
  },
  editInput: {
    flex: 1, // Matches the display text width
    fontSize: 16, // Same as displayed text
    fontWeight: "bold", // Keep font style identical
    color: "#333", // Keep text color the same
    textAlign: "center", // Keep text centered
    paddingVertical: 0, // Prevents any extra space
    height: 24, // Matches normal text height
    borderBottomWidth: 0, // Removes underline
  },  
  centerText: {
    textAlign: "center",
  },
  present: {
    textDecorationLine: "line-through",
    color: "#008000",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 5,
    borderRadius: 4,
    padding: 5,
  },
  summary: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },
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
    marginBottom: 4,
  },
});

export default App;
