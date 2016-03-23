---
title: How do I share files with others?
published: false
---
To give others access to your encrypted files they will need access to the Cryptomator vault (the folder you selected when creating / opening the vault) and your password.

### How do I give others access to the Cryptmator vault?

If you can not remember where exactly your vault is stored you can hover it in Cryptomator to show a tooltip with the location. How you make this directory accessible by others depends on the cloud provider you are using. Some allow to share files using the context menu in your file system, others allow to share files using the web interface. Consult the documentation of your cloud provider on how to do it.

### How do I transfer the password?

In general you should only transfer the password in a secure way. For example an encrypted messaging service, encrypted mail or similar are good. If possible you may tell the password in person.

### What if I only want to share some of my files?

If you want to share only some files but want to have more files encrypted you can create separate vaults with different passwords. Thus you can share the contents of one vault but not the other.

### Can I revoke access to the vault by changing the password?

No. Even after chaning the password another user could still access the vault if he stored a copy of the key somewhere. To disallow access you will have to create a new vault with a new password and copy everything over.

Please be aware that even if you do that a user who once had access may have made copies of all files stored in the vault at that time.
