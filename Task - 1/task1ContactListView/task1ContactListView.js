import { LightningElement, api, wire, track } from 'lwc';
import getContactRecordsByKey from '@salesforce/apex/Task1Helper.getContactRecordsByKey';

export default class Task1ContactListView extends LightningElement {

    @api searchKey = '';
    @api feild = '';
    data;
    error;

    @track paginatedData = [];
    currentPage = 1;
    pageSize = 10;
    totalPages = 0;

    columns = [
        { label: 'Last Name', fieldName: 'contactUrl', type: 'url',
            typeAttributes: { label: { fieldName: 'LastName' }, target: '_blank' }
        },
        { label: 'Account Name', fieldName: 'accountUrl', type: 'url',
            typeAttributes: { label: { fieldName: 'AccountName' }, target: '_blank' }
        },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' }
    ];
    
    connectedCallback(){
        this.searchKey = null;
        this.feild = 'NAME';
    }

    @wire(getContactRecordsByKey, { feildName: '$feild', searchKey: '$searchKey' })
    wiredContacts({ data, error }) {
        if (data) {
            this.data = data.map(contact => {
                return {
                        ...contact,
                        contactUrl: '/' + contact.Id,
                        accountUrl: contact.AccountId ? '/' + contact.AccountId : null,
                        AccountName: contact.Account ? contact.Account.Name : ''
                    }
            });
            this.totalPages = Math.ceil(data.length / this.pageSize);
            this.updatePaginatedData();
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

     updatePaginatedData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedData = this.data.slice(start, end);
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedData();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedData();
        }
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }
}


//     connectedCallback(){
//         this.handleSearch();
//     }

//     handleSearch() {
//         getContactRecordsByKey({feildName: 'Name', searchKey: this.searchKey})
//             .then(result => {
//                 this.data = result.map(contact => {
//                     return {
//                         ...contact,
//                         contactUrl: '/' + contact.Id,
//                         accountUrl: contact.AccountId ? '/' + contact.AccountId : null,
//                         AccountName: contact.Account ? contact.Account.Name : ''
//                     }
//                 })  
//                 this.error = undefined;
//             })
//             .catch(error => {
//                 this.error = error;
//                 this.data = undefined;
//             })
//     }
// }