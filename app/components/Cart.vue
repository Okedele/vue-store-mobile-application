<template>
    <Page>
        <ActionBar title="CART" class="page">
            <ActionItem @tap="store" ios.systemIcon="16" ios.position="right" text="Store" android.position="popup" />
            <ActionItem @tap="logout" ios.systemIcon="16" ios.position="right" text="Logout" android.position="popup" />
        </ActionBar>
        <GridLayout rows="*,*">
            <Label v-show="allCart.length === 0" class="body m-20" :text="'Add some items to cart!'" textWrap="true" style="font-size: 30; color: white"></Label>
            <StackLayout row="0">
                <ListView class="lst-group" for="item in allCart" style="height: 100%">
                    <v-template>
                        <GridLayout columns="50,*,*,*" rows="*,*" class="list-item list-item-name">
                            <Image row="0" col="0" :src="'~/assets/' +item.image_tag " class=" emoji" />
                            <Label row="0" col="1" :text="item.title" class="lab" verticalAlignment="center" textWrap="true" style="width: 100%"/>
                            <Label row="1" col="1" :text="'$' + item.price + ' x ' + item.qty" class="lab" horizontalAlignment="left" style="margin-top: 30;"/>
                            <Button @tap="addToCart(item.id)" row="1" col="2" class="purple nav-btn fa close" text.decode="&#xf055;" horizontalAlignment="right" style="margin-right: -50"/>
                            <Button @tap="deleteFromCart(item.id)" row="1" col="3" class="purple nav-btn fa close" text.decode="&#xf056;" horizontalAlignment="right" style="margin-right: 0"/>
                        </GridLayout>
                    </v-template>
                </ListView>
            </StackLayout>
            <ActivityIndicator rowSpan="4" :busy="processing">
            </ActivityIndicator>
            <StackLayout row="1">
                <Label v-show="allCart.length != 0" class="body m-20" :text="'Total: $' + total" textWrap="true" style="font-size: 30; color: white"></Label>
                <Button :isEnabled="allCart.length != 0" class="btn btn-primary" text="Checkout" @tap="checkout"></Button>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import Home from "./Home";
    import Store from "./Store";
    import axios from "axios";
    const appSettings = require("tns-core-modules/application-settings");
    export default {
        data() {
            return {
                processing: false,
                allCart: []
            };
        },
        computed: {
            total() {
                return this.allCart.reduce((acc, allCart) => {
                    return (Number(allCart.qty) * allCart.price) + acc;
                }, 0).toFixed(2);
            }
        },
        methods: {
            getAllCart() {
                this.processing = true;
                const token = appSettings.getString("token");
                axios.get('https://store-adonis-api.herokuapp.com/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((response) => {
                    this.processing = false;
                    const cart_response = response.data.data;
                    cart_response.forEach((cart, index) => {
                        this.allCart.push({
                            id: cart.product.id,
                            title: cart.product.title,
                            description: cart.product.description,
                            product_type: cart.product.product_type,
                            image_tag: cart.product.image_tag,
                            price: cart.price,
                            qty: cart.qty
                        });
                    });
                });
            },
            addToCart(cartItem) {
                this.processing = true;
                const token = appSettings.getString("token");
                axios.post('https://store-adonis-api.herokuapp.com/cart',
                    {
                        product_id: cartItem
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                }).then((response) => {
                    this.processing = false;
                    this.alert("Item successfully added to cart");
                    this.allCart = [];
                    const cart_response = response.data.data;
                    cart_response.forEach((cart, index) => {
                        this.allCart.push({
                            id: cart.product.id,
                            title: cart.product.title,
                            description: cart.product.description,
                            product_type: cart.product.product_type,
                            image_tag: cart.product.image_tag,
                            price: cart.price,
                            qty: cart.qty
                        });
                    });
                });
            },
            deleteFromCart(cartItem) {
                this.processing = true;
                const token = appSettings.getString("token");
                axios.post('https://store-adonis-api.herokuapp.com/cart/delete',
                    {
                        product_id: cartItem
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((response) => {
                    this.processing = false;
                    this.alert("Item successfully reduced/deleted in cart");
                    this.allCart = [];
                    const cart_response = response.data.data;
                    cart_response.forEach((cart, index) => {
                        this.allCart.push({
                            id: cart.product.id,
                            title: cart.product.title,
                            description: cart.product.description,
                            product_type: cart.product.product_type,
                            image_tag: cart.product.image_tag,
                            price: cart.price,
                            qty: cart.qty
                        });
                    });
                });
            },
            checkout() {
                this.processing = true;
                const token = appSettings.getString("token");
                axios.post('https://store-adonis-api.herokuapp.com/cart/checkout', {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(() => {
                    this.processing = false;
                    this.alert("Successfully checked out. Thanks for shopping with VUE STORE");
                    this.store();
                });
            },
            store() {
                this.processing = true;
                this.$navigateTo(Store, {
                    clearHistory: true
                });
            },
            logout() {
                this.processing = true;
                appSettings.remove("token");
                this.$navigateTo(Home, {
                    clearHistory: true
                });
            },
            alert(message) {
                return alert({
                    title: "VUE STORE",
                    okButtonText: "OK",
                    message: message
                });
            }
        },
        created() {
            this.getAllCart();
        }
    };
</script>

<style scoped>
    .btn-primary {
        height: 50;
        background-color: #D51A1A;
        border-radius: 5;
        font-size: 20;
        font-weight: 600;
    }
    .btn-primary:disabled {
        opacity: 0.5;
    }

    page {
        color: #FFF;
        background: linear-gradient(to right top, #2C163D, #142237);
    }

    .page {
        color: #FFF;
        background: linear-gradient(to right top, #2C163D, #142237);
    }

    .fa {
        font-family: FontAwesome, fontawesome-webfont;
        color: #FFF;
    }

    .header {
        font-size: 50;
        padding: 20;
        text-align:center;
    }

    .med {
        font-size: 18;
    }

    .lg {
        font-size: 24;
    }

    .lab {
        margin-left: 10;
    }

    .title {
        text-align: center;
        text-transform: uppercase;
        margin-top: 20;
        font-family: NunitoSans-Bold, Nunito;
        font-size: 18;
        font-weight: bold;
        color: #D3DBEA;
    }

    .card-title {
        text-align: center;
        text-transform: uppercase;
        color: #0F1E39;
        font-family: Passion, PassionOne, PassionOne-Regular;
        font-size: 30;
    }

    .card {
        border-radius: 20;
        margin: 12;
        padding: 10;
        background-color: #E3E9F8;
        color: #131636;
        height: 86%;
    }

    .nav-btn {
        color: white;
        margin: 20;
        font-size: 40;
    }

    .list-item {
        margin: 3;
        padding: 5, 12;
        color: black;
        background-color: #E3E9F8;
        font-size: 22;
        border-radius: 10;
    }

    .list-item-name {
        font-size: 22;
        font-family: Passion, PassionOne, PassionOne-Regular;
    }

    .list-item-meaning {
        font-size: 15;
        font-family: Nunito, NunitoSans, NunitoSans-Regular;
        color: #131636;
    }

    .modal {
        height: 70%;
    }

    .emoji {
        text-align: center;
        padding: 10;
        font-size: 100;
        color: #333333;
        border-color: black;
        text-shadow: 0 0 3px 0 rgb(1, 0, 0);
    }

    .reversed {
        transform: rotate(180deg);
    }

    .close {
        font-size: 25;
        color: #131636;
    }

    .emoji_window {
        height: 80;
        width: 80;
        margin-bottom: 20;
    }
    .btn-primary {
        height: 50;
        background-color: #D51A1A;
        border-radius: 5;
        font-size: 20;
        font-weight: 600;
    }
    .btn-primary:disabled {
        opacity: 0.5;
    }

</style>
