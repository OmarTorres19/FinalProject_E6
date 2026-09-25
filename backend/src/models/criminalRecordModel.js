// Se ejecutan secuencias de SQL para comunicarse con la DB.
const { getConnection, sql } = require("../config/database"); //conexión a db

// Leer archivos
const getActiveRecords = async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT * FROM CriminalRecords WHERE IsDeleted = 0
    `);
    return result.recordset;
};

//Leer archivos eliminados
const getDeleteRecords = async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT * FROM CriminalRecords WHERE IsDeleted = 1
    `);
    return result.recordset;
};

//Crear archivos
const createRecord = async (ownerId, alias, age, height, eyeColor, encryptedFullName, encryptedLocaiton) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('OwnerID', sql.Int, ownerId)
        .input('Alias', sql.VarChar, alias)
        .input('Age', sql.Int, age)
        .input('Height', sql.Decimal(5,2), height)
        .input('EyeColor', sql.VarChar, eyeColor)
        .input('FullName', sql.VarChar, encryptedFullName) //entra el dato ya cifrado
        .input('LastKnownLocation', sql.VarChar, encryptedLocaiton)
        .query(`
            INSERT INTO CriminalRecords (OwnerID, Alias, Age, Height, EyeColor, FullName, LastKnownLocation)
            OUTPUT inserted.RecordID
            VALUES (@OwnerID, @Alias, @Age, @Height, @EyeColor, @FullName, @LastKnownLocation)
        `);
        return result.recordset[0];
};

//Editar datos
const updateRecord = async (recordId, alias, age) => {
    const pool = await getConnection();
    await pool.request()
        .input('RecordID', sql.Int, recordId)
        .input('Alias', sql.VarChar, alias)
        .input('Age', sql.Int, age)
        .query(`
            UPDATE CriminalRecords
            SET Alias = @Alias, Age = @Age
            WHERE RecordID = @RecordID AND IsDeleted = 0
        `);
};

//Mover a papelera
const softDeleteRecord = async (recordId) => {
    const pool = await getConnection();
    await pool.request()
        .input('RecordID', sql.Int, recordId)
        .query(`UPDATE CriminalRecords SET IsDeleted = 1 WHERE RecordID = @RecordID`);
};

//Restaurar
const restoreRecord = async (recordId) => {
    const pool = await getConnection();
    await pool.request()
        .input('RecordID', sql.Int, recordId)
        .query(`UPDATE CriminalRecords SET IsDeleted = 0 WHERE RecordID = @RecordID`);
};

module.exports = {
    getActiveRecords, getDeleteRecords, createRecord, updateRecord, softDeleteRecord, restoreRecord
}