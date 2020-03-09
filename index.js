// to trap if the the nav toggle is clicked or not
let isOpen = false;

function toggleNavBar() {
   if(isOpen){
       isOpen = false
       document.getElementById("header-option").classList.remove("open_nav");
       document.getElementById("header-option").classList.add("close_nav");
   }else{
    isOpen = true
    document.getElementById("header-option").classList.remove("close_nav");
    document.getElementById("header-option").classList.add("open_nav");
   }
}
document.getElementById("nav-toggle").addEventListener("click",toggleNavBar);

//To add books
document.getElementById("addBoook").addEventListener("click",toggleNavBar);
//To view registered books
document.getElementById("viewBook").addEventListener("click",toggleNavBar);

let contractInstance = null
let client = null
let contractAddress ="ct_2q61BRQoiK2cXYAxeUSYSE7JD7Y1iVPiLtVukrWcjVjVVzyrWg";
let contractSource =`

contract BookLibraryContract =

    record bookInfo = {
        bookName:string,
        bookIsbn:string,
        storedDate:string
        }

    record state = {
        bookLibrarian: map(address, list(bookInfo))
        }

    stateful entrypoint init() = {bookLibrarian ={}}

    stateful entrypoint registerBook(bookName':string,bookIsbn':string, storedDate':string) =
   
        let userListOfBooks = Map.lookup_default(Call.caller, state.bookLibrarian,[])

    
        let newBookInfo ={bookName = bookName',bookIsbn = bookIsbn', storedDate = storedDate'}
       
        let newListOfBook = newBookInfo::userListOfBooks
    
        put(state{bookLibrarian[Call.caller] = newListOfBook})


    entrypoint getUserListBooks()=
        Map.lookup_default(Call.caller,state.bookLibrarian,[]) 
`;

window.addEventListener('load', async function(){
    client = await Ae.Aepp()
    contractInstance=await client.getContractInstance(contractSource,{contractAddress});
    let allBooks=  (await contractInstance.methods.getUserListBooks()).decodedResult;
    console.log(allBooks,"all books");

    allBooks.map(book=>{
        addBookToDom(book.bookName,book.bookIsbn);
    });
    document.getElementById("loader").style.display="none";
})



async function handleSubmitClick(){
    let title=document.getElementById("input_bookTitle").value;
    let isbn=document.getElementById("input_bookIsbn").value;
    let date = document.getElementById("input_date").value

    if(title.trim() !="" && isbn.trim() !="" && date.trim() !="" ){
        document.getElementById("loader").style.display="block";
     let result   =await contractInstance.methods.registerBook(title,isbn,date);
        console.log(title,result);
        addBookToDom(title,isbn);
        document.getElementById("loader").style.display="none";
    }
   
}

document.getElementById("submit_book").addEventListener("click",handleSubmitClick);
function addBookToDom(title,isbn){
    let allBooks = document.getElementById("list-of-books");
    //to create a new book div
    let newBookDiv = document.createElement("div");
    newBookDiv.classList.add("books");
    //to create the new book paragraph title
    let newBookTitle = document.createElement("p");
    newBookTitle.innerText = title;
    //to create the new book paragraph title
    let newBookIsbn = document.createElement("p");
    newBookIsbn.innerText = isbn;

    newBookDiv.appendChild(newBookTitle);
    newBookDiv.appendChild(newBookIsbn);
    allBooks.appendChild(newBookDiv);

}
