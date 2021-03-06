/* global React, AlloyEditor */

(function() {
	'use strict';

	var Util = Liferay.Util;

	var ButtonImage = React.createClass(
		{
			displayName: 'ButtonImage',

			propTypes: {
				editor: React.PropTypes.object.isRequired,
				imageTPL: React.PropTypes.string
			},

			componentWillUnmount: function() {
				var instance = this;

				if (instance._itemSelectorDialog) {
					instance._itemSelectorDialog.destroy();
				}
			},

			getDefaultProps: function() {
				return {
					imageTPL: new CKEDITOR.template('<img src="{src}" />')
				};
			},

			statics: {
				key: 'image'
			},

			render: function() {
				return React.createElement(
					'button',
					{
						className: 'alloy-editor-button',
						'data-type': 'button-image',
						onClick: this._handleClick,
						tabIndex: this.props.tabIndex
					},
					React.createElement(
						'span',
						{
							className: 'alloy-editor-icon-image'
						}
					)
				);
			},

			_handleClick: function() {
				var instance = this;

				var editor = this.props.editor.get('nativeEditor');

				var eventName = editor.name + 'selectDocument';

				if (instance._itemSelectorDialog) {
					instance._itemSelectorDialog.open();
				}
				else {
					AUI().use(
						'liferay-item-selector-dialog',
						function(A) {
							var itemSelectorDialog = new A.LiferayItemSelectorDialog(
								{
									eventName: eventName,
									on: {
										selectedItemChange: A.bind('_onSelectedItemChange', instance)
									},
									url: editor.config.filebrowserImageBrowseUrl
								}
							);

							itemSelectorDialog.open();

							instance._itemSelectorDialog = itemSelectorDialog;
						}
					);
				}
			},

			_onSelectedItemChange: function(event) {
				var instance = this;

				var editor = instance.props.editor.get('nativeEditor');

				var eventName = editor.name + 'selectDocument';

				var selectedItem = event.newVal;

				if (selectedItem) {
					Util.getWindow(eventName).onceAfter(
						'visibleChange',
						function() {
							var image = CKEDITOR.dom.element.createFromHtml(
								instance.props.imageTPL.output(
									{
										src: selectedItem.value
									}
								)
							);

							editor.insertElement(image);
						}
					);
				}
			}
		}
	);

	AlloyEditor.Buttons[ButtonImage.key] = AlloyEditor.ButtonImage = ButtonImage;
}());