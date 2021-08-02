import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import AddIcon from '@material-ui/icons/Add';
import { TableHead, TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ServiceApi } from '../../Service';
import { useDispatch } from 'react-redux';
import './Home.scss'
import { postQuestionsAction } from '../../Store/actions';
import { useHistory } from 'react-router';

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },

    }),
);

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}




const Home: React.FC = () => {
    interface questionType {
        title: string,
        content: string,
        answer: string,
        id: number
    }
    
    const dispatch = useDispatch()
    

    const [rows, setRows] = useState<questionType[]>([])
    useEffect(() => {
        new ServiceApi().getQuestions().then(response => {
            for (let key in response.data) {
                setRows(oldArray => [...oldArray, response.data[key]]);

            }
        })
        dispatch(postQuestionsAction(rows))

    }, [])






    const useStyles2 = makeStyles((theme) => ({
        table: {
            minWidth: 500,

        },
        addQuestion: {
            display: 'flex',
            flexDirection: 'column',
            margin: theme.spacing(3),
        }
    }));
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    const [add, setAdd] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContet] = useState("")
    const [answer, setAnswer] = useState("")
    const history = useHistory()

    const addData = () => {

        new ServiceApi().postQuestions(title, answer, content)
        setTitle("")
        setContet("")
        setAnswer("")
    }
    const close = () => {
        setAdd(false)
        setTimeout(() => {
            window.location.reload()
        }, 200)
    }
    const gotoLink = (questionid:any)=>{
        history.push(`/questions/${questionid}`)
    }
    const [loginedUser,setLoginedUser] = useState<string | null>("")
    useEffect(()=>{
        if(localStorage.getItem("username")){
            setLoginedUser(localStorage.getItem("username"))
            
        }
        
    },[])
    
    return (
        <div className="container mt-4">
            {
                add && <div className="add__question__box d-center">

                    <form className={classes.addQuestion} noValidate autoComplete="off">
                        <div className="close" onClick={close}><CloseIcon /></div>
                        <TextField value={title} onChange={(e) => setTitle(e.target.value)} id="outlined-basic" label="Title" variant="outlined" />
                        <TextField value={content} onChange={(e) => setContet(e.target.value)} id="outlined-basic" label="Content" variant="outlined" />
                        <TextField value={answer} onChange={(e) => setAnswer(e.target.value)} id="outlined-basic" label="Answer" variant="outlined" />
                        <Button disabled={title.length <= 0 || content.length <= 0 || answer.length <= 0} onClick={addData} variant="contained" color="primary">
                            Add
                        </Button>
                    </form>
                </div>
            }
            {
                !add && <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="custom pagination table">
                        <TableHead style={{backgroundColor:'#3f51b5'}}>
                            <TableRow>
                                <TableCell style={{color:'white'}}>Title</TableCell>
                                <TableCell style={{color:'white'}}>Content</TableCell>
                                {!loginedUser && <TableCell style={{color:'white'}}>Answer</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : rows
                            ).map((row) => (

                                <TableRow onClick={()=>gotoLink(row.id)} style={{ cursor: "pointer" }} key={row.id}>

                                    <TableCell component="th" scope="row">
                                        {row.title}
                                    </TableCell>
                                    <TableCell  >
                                        {row.content}
                                    </TableCell>
                                    {
                                        !loginedUser && <TableCell  >
                                        {row.answer}
                                                </TableCell>
                                    }

                                    
                                </TableRow>

                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            }

            {
                !add && !loginedUser ? <div onClick={() => setAdd(!add)} className="add__box mt-4">
                    <AddIcon />
                </div>
                : null
            }
            
        </div>
    );
}

export default Home
