// const mockedModule = jest.createMockFromModule('notistack'); // <-- This is the change

let snackBar;

let setSnackbar = (value) =>  snackBar = value;
let resetSnackBar = () =>{
    snackBar = { enqueueSnackbar: jest.fn()};
}

resetSnackBar();

let useSnackbar = () =>  snackBar;
let SnackbarProvider = jest.fn();

module.exports = { useSnackbar, setSnackbar, resetSnackBar , SnackbarProvider};