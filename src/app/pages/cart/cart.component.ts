import { ChangeDetectorRef, Component, HostListener, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Device } from '../../shared/models/Device';
import { CartService } from '../../shared/services/cart.service';
import { CartItem } from '../../shared/models/CartItem';
import { MainService } from '../../shared/services/main.service';
import { MultiplyPricePipe } from '../../shared/pipes/multiply-price.pipe';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{

  items: Array<Device> = [];
  imageUrlsMap: { [id: string]: string } = {};
  cartItems: Array<CartItem> = [];
  user?: firebase.default.User | null;
  deleteItem: CartItem = {userId: '', itemId: '', cartedCount: 1};
  look?: boolean;
  title?: boolean;

  constructor(private cartService: CartService, private renderer: Renderer2, private mainService: MainService, private multiplyPricePipe: MultiplyPricePipe) { }

  ngOnInit(): void {
    if (window.innerWidth < 992) {
      this.look = true;
      if(window.orientation == 90){
        this.title = true;
      } else{
        this.title = false;
      }
    } else{
      this.look = false;
    }
    this.user = JSON.parse(localStorage.getItem('user') as string);
    this.cartService.getAllByUserId().subscribe(data => {
      this.cartItems = data;
      this.getItems();
    });
  }

  @HostListener('window:resize')
  onResize() {
    const divElement = document.getElementById('grid-div');
    if (window.innerWidth < 992) {
      this.renderer.addClass(divElement, 'grid-one');
      this.renderer.removeClass(divElement, 'grid-two');
    } else {
      this.renderer.addClass(divElement, 'grid-two');
      this.renderer.removeClass(divElement, 'grid-one');
    }
  }

  @HostListener('window:orientationchange')
  onOrientationChange() {
    window.location.reload();
  }

  getItems() {
    for (const obj of this.cartItems) {
      this.mainService.getDeviceById(obj.itemId).subscribe(data => {
        this.items.push(data);
        this.loadImages();
      });
    }
  }

  loadImages(){
    for (const obj of this.items) {
      this.mainService.loadImage(obj.imageResource).subscribe(
        url => {
          this.imageUrlsMap[obj.id] = url;
        },
        error => {
          console.error('Failed to load image:', error);
        }
      );
    }
  }

  onDelete(item: Device) {
    for (const obj of this.cartItems) {
      if(obj.userId == this.user?.uid && obj.itemId == item.id){
        this.deleteItem = obj;
      }
    }
    this.cartService.delete(this.deleteItem).then(() => {
      console.log('CartItem deleted successfully!');
      this.cartItems = this.cartItems.filter(item => item.itemId !== this.deleteItem.itemId || item.userId !== this.deleteItem.userId);
      window.location.reload();
    }).catch(error => {
      console.error('Error deleting CartItem:', error);
    });
  }

  getCartItemQuantity(itemId: string): number {
    const cartItem = this.cartItems.find(item => item.itemId === itemId);
    return cartItem ? cartItem.cartedCount : 0;
  }

  getTotalPrice(item: Device): number {
    const quantity = this.getCartItemQuantity(item.id);
    return this.multiplyPricePipe.transform(item.price, quantity);  
  }

  deleteAll(){
    for (const obj of this.cartItems) {
      this.cartService.delete(obj).then(() => {
        this.cartItems = this.cartItems.filter(item => item.itemId !== this.deleteItem.itemId || item.userId !== this.deleteItem.userId);
        window.location.reload();
      }).catch(error => {
        console.error('Error deleting CartItem:', error);
      });
    }
  }
}
