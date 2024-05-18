import { Component, OnInit, Renderer2, HostListener, Input } from '@angular/core';
import { MainService } from '../../shared/services/main.service';
import { Device } from '../../shared/models/Device';
import { CartService } from '../../shared/services/cart.service';
import { CartItem } from '../../shared/models/CartItem';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  items: Array<Device> = [];
  imageUrlsMap: { [id: string]: string } = {};
  user?: firebase.default.User | null;
  loggedIn?: boolean;
  cartItems?: Array<CartItem> = [];
  look?: boolean;

  constructor(private mainService: MainService, private renderer: Renderer2, private cartService: CartService) { }

  ngOnInit(): void {
    if (window.innerWidth < 992) {
      this.look = true;
    } else{
      this.look = false;
    }
    this.mainService.loadImageMeta('__credits.json').subscribe((data: Array<Device>) => {
      this.user = JSON.parse(localStorage.getItem('user') as string);
      if (this.user){
        this.loggedIn=true;
      } else {
        this.loggedIn=false;
      }
      this.items = data;
      this.loadImages();
    })
    this.cartService.getAllByUserId().subscribe(data => {
      this.cartItems = data;
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

  addToCart(currentItemId: string){
    console.log(this.cartItems);
    var exist: number = 1;
    for (const obj of this.cartItems as CartItem[]){
      if (obj.itemId == currentItemId){
        this.cartService.update(obj).then(_ => {
          console.log('Update was successfully done!')
        })
        exist = 0;
        break;
      }
    }
    if (exist == 1){
      const newCartItem: CartItem = {
        userId: this.user?.uid as string,
        itemId: currentItemId,
        cartedCount: 1,
      }
      this.cartService.create(newCartItem).then(_ => {
        console.log('New item successfully added to cart!')
      }).catch (error => {
        console.error(error);
      })
    }
  }
}
