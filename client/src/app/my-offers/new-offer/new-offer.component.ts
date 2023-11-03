import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OffersService } from 'src/app/services/offers.service';
import { Observable } from 'rxjs';
import { Message } from 'primeng/api';
import { MessagesService } from 'src/app/services/messages.service';
import { Router } from '@angular/router';

interface Category {
  name: string;
  code: string;
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.css'],
})
export class NewOfferComponent implements OnInit {
  newOfferForm!: FormGroup;
  categories: Category[] | undefined;
  isLoading: boolean = false;
  messages: Message[] = [];
  photoUrl: string = '';
  selectedFile!: File;

  constructor(
    private offersService: OffersService,
    private messagesService: MessagesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.messagesService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
    this.categories = [
      { name: 'Electronics', code: 'Electronics' },
      { name: 'Health', code: 'Health' },
      { name: 'Fashion', code: 'Fashion' },
      { name: 'Beauty', code: 'Beauty' },
      { name: 'Garden', code: 'Garden' },
      { name: 'Gaming', code: 'Gaming' },
    ];
    this.newOfferForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      category: new FormControl('Electronics', Validators.required),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      price: new FormControl(null, [
        Validators.required,
        Validators.maxLength(5),
      ]),
      negotiate: new FormControl(false, Validators.required),
      phone: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      address: new FormControl(null, Validators.required),
      image: new FormControl(null),
    });
  }

  setAddress(address: string) {
    this.newOfferForm.patchValue({
      address: address,
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
    this.offersService.uploadPhoto(this.selectedFile)!.subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmitForm() {
    const sendingForm = {
      name: this.newOfferForm.value.name,
      category: this.newOfferForm.value.category.name,
      description: this.newOfferForm.value.description,
      price: this.newOfferForm.value.price,
      negotiate: this.newOfferForm.value.negotiate,
      phone: this.newOfferForm.value.phone,
      address: this.newOfferForm.value.address,
      image: this.newOfferForm.value.image,
    };

    let offerObs: Observable<{}>;
    this.isLoading = true;
    offerObs = this.offersService.createNewOffer(sendingForm);
    offerObs.subscribe(
      (resData) => {
        this.isLoading = false;
        this.messagesService.setMessage(
          'success',
          'Success',
          'Offer has been added!'
        );
        this.router.navigate(['/my-offers']);
      },
      (error) => {
        this.isLoading = false;
        this.messagesService.setMessage(
          'error',
          'Error',
          'Something went wrong!'
        );
      }
    );
  }
}
