"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("@nativescript/core/color");
var viewModule = require("@nativescript/core/ui/core/view");
var view_base_1 = require("@nativescript/core/ui/core/view-base");
var viewCommon = require("@nativescript/core/ui/core/view/view-common").ViewCommon;
function overrideModalViewMethod() {
    viewModule.View.prototype._showNativeModalView = iosModal;
}
exports.overrideModalViewMethod = overrideModalViewMethod;
function iosModal(parent, options) {
    var _this = this;
    var parentWithController = viewModule.ios.getParentWithViewController(parent);
    if (!parentWithController) {
        view_base_1.traceWrite("Could not find parent with viewController for " + parent + " while showing modal view.", view_base_1.traceCategories.ViewHierarchy, view_base_1.traceMessageType.error);
        return;
    }
    var parentController = parentWithController.viewController;
    if (parentController.presentedViewController) {
        view_base_1.traceWrite("Parent is already presenting view controller. Close the current modal page before showing another one!", view_base_1.traceCategories.ViewHierarchy, view_base_1.traceMessageType.error);
        return;
    }
    if (!parentController.view || !parentController.view.window) {
        view_base_1.traceWrite("Parent page is not part of the window hierarchy.", view_base_1.traceCategories.ViewHierarchy, view_base_1.traceMessageType.error);
        return;
    }
    this._setupAsRootView({});
    viewCommon.prototype._showNativeModalView.call(this, parentWithController, options);
    var controller = this.viewController;
    if (!controller) {
        var nativeView = this.ios || this.nativeViewProtected;
        controller = viewModule.ios.UILayoutViewController.initWithOwner(new WeakRef(this));
        if (nativeView instanceof UIView) {
            controller.view.addSubview(nativeView);
        }
        this.viewController = controller;
    }
    controller.modalPresentationStyle = options.fullscreen ?
        5 :
        6;
    controller.modalTransitionStyle = 0;
    controller.providesPresentationContextTransitionStyle = true;
    controller.definesPresentationContext = true;
    var backgroundColor = this.backgroundColor;
    var dimAmount = options.dimAmount !== undefined ? options.dimAmount : 0.5;
    this.backgroundColor = backgroundColor ?
        new color_1.Color(255 * dimAmount, backgroundColor.r, backgroundColor.g, backgroundColor.b) :
        new color_1.Color(255 * dimAmount, 0, 0, 0);
    if (options.ios && options.ios.presentationStyle) {
        var presentationStyle = options.ios.presentationStyle;
        controller.modalPresentationStyle = presentationStyle;
        if (presentationStyle === 7) {
            var popoverPresentationController = controller.popoverPresentationController;
            this._popoverPresentationDelegate = viewModule.ios.UIPopoverPresentationControllerDelegateImp.initWithOwnerAndCallback(new WeakRef(this), this._closeModalCallback);
            popoverPresentationController.delegate = this._popoverPresentationDelegate;
            var view = parent.nativeViewProtected;
            popoverPresentationController.sourceView = view;
            popoverPresentationController.sourceRect = CGRectMake(0, 0, view.frame.size.width, view.frame.size.height);
        }
    }
    this.horizontalAlignment = "stretch";
    this.verticalAlignment = "stretch";
    this._raiseShowingModallyEvent();
    var animated = options.animated === undefined ? true : !!options.animated;
    controller.animated = animated;
    parentController.presentViewControllerAnimatedCompletion(controller, animated, null);
    var transitionCoordinator = parentController.transitionCoordinator;
    if (transitionCoordinator) {
        UIViewControllerTransitionCoordinator.prototype.animateAlongsideTransitionCompletion
            .call(transitionCoordinator, null, function () { return _this._raiseShownModallyEvent(); });
    }
    else {
        this._raiseShownModallyEvent();
    }
}
//# sourceMappingURL=windowed-modal.ios.js.map