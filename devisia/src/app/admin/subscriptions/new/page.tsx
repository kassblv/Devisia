// Réutiliser directement le composant de la page dynamique [id] avec l'id "new"
// Pour éviter la boucle de redirection

import SubscriptionFormPage from '../[id]/page';

export default function NewSubscriptionPage() {
  // On passe "new" comme id pour indiquer qu'il s'agit d'un nouveau plan
  return <SubscriptionFormPage params={{ id: "new" }} />;
}
