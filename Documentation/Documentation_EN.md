# Simple SQLite Documentation

Welcome to the documentation section! Here we will explain the current scope of this library and its syntax.

**Simple SQLite** is a lightweight Node.js library built on **better-sqlite3**, which simplifies the use of SQLite through a simple and secure API. It is ideal for small or educational projects.

## Return Format

Most methods of **Simple SQLite** return an object with the following structure:

```javascript
{
  success: boolean,   // indicates if the operation was successful
  message: string,    // informational or error message
  list?: array        // query results (only in SELECT)
}
```

### Implemented Functions

- Connexion
- Table
- Insert
- Delete
- SelectAll
- Select
- SelectLike
- Update
- DropTable

### Technologies Used

- Node.js
- SQLite
- better-sqlite3

### Limitations

Arithmetic and relational operators such as >, <, >=, <= are not yet supported.

### Installation

Command to install the Simple-sqlite library:

```bash
npm install simple-sqlite
```

### Security

All queries use safe parameters, preventing user input from being directly injected into SQL statements.
For example, instead of doing this:

```sql
SELECT * FROM users WHERE name = ' " + userInput + " ';
```

Do this:

```sql
SELECT * FROM users WHERE name = ?;
```

### Initialization / Connection

If the database does not exist, it will be created; if it exists, it will be used:

```javascript
const sqlite = require("simple-sqlite");
// This initializes the database connection
sqlite.Connexion("test.db");
```

Note: The connection is initialized internally and used by all other functions.

### Creating Tables

```javascript
const users = sqlite.Table({
  name: "users",
  data: ["id INTEGER PRIMARY KEY AUTOINCREMENT", "name TEXT NOT NULL"],
});

// to show a message indicating if the query was successful
console.log(users);
```

Note: All tables created automatically include IF NOT EXISTS to avoid errors if the query is run again.

### Inserting Data

```javascript
const user = sqlite.Insert({
  table: "users",
  // the columns array must match the length of the data array
  columns: ["name"],
  data: ["alberto"],
});

console.log(user);
```

Note: It is not necessary to include the id column if it is defined as AUTOINCREMENT in the table.

### Deleting a Row from a Table

```javascript
const deleted = sqlite.Delete({
  table: "users",
  where: ["id"],
  data: [1],
});

console.log(deleted);
```

### SelectAll -> Retrieve All Rows from a Table

```javascript
const allUsers = sqlite.SelectAll({
  table: "users",
});

console.log(allUsers);
```

Note: You can iterate over the returned array to access its properties for a cleaner display.

**Example**

```javascript
if (allUsers.success) {
  for (const u of allUsers.list) {
    console.log(u.id, u.name);
  }
} else {
  console.error(allUsers.message);
}
```

If the table contains data, it returns success and list.

### Select -> Retrieve Specific Data from a Table

**OR Condition**

```javascript
const data = sqlite.Select({
  table: "users",
  columns: ["id", "name"],
  where: ["name"],
  operator: "OR",
  data: [4, "alberto"],
});

console.log(data);
```

Note: When using an OR condition with only one column in where (e.g., "name"), all values in data are considered for the query.

**AND Condition**

Case 1:

```javascript
const data = sqlite.Select({
  table: "users",
  columns: ["name"],
  where: ["id", "name"],
  operator: "AND",
  data: [4, "alberto"],
});

console.log(data);
```

Case 2 (AND is default):

```javascript
const data = sqlite.Select({
  table: "users",
  columns: ["name"],
  where: ["id", "name"],
  data: [4, "alberto"],
});

console.log(data);
```

Note: If no operator is specified, conditions in where are automatically joined with AND.

### SelectLike

This method is for queries using the LIKE condition (can combine AND and OR):

```javascript
const query = sqlite.SelectLike({
  table: "users",
  columns: ["id", "name"],
  where: ["name"],
  data: ["a%"],
});

console.log(query);
```

Note: The values in data must be strings, since LIKE queries search by text patterns.

### Update

```javascript
// Updates the column "name" to "alex"
// where id = 3 AND name = "alberto"

const u = sqlite.Update({
  table: "users",
  columns: ["name"],
  dataColumn: ["alex"], // new value
  where: ["id", "name"], // condition, AND is default if not specified
  dataCondition: [3, "alberto"], // values for the condition
});

console.log(u);
```

Note:

1. columns and dataColumn must have the same length, as each value in dataColumn is assigned to its corresponding column.
2. where defines the columns used as conditions.
3. dataCondition contains the values for each condition in the same order.
4. If no logical operator is specified, conditions in where are automatically joined with AND.

### DropTable

This function allows you to delete the entire table from the database:

```javascript
const table = sqlite.DropTable({
  table: "users",
});
```

Note: Deleting a table is permanent.
